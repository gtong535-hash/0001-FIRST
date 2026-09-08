// ==========================================================================
// DevLog 블로그 회원가입 & 로그인 백엔드 API (Google Apps Script)
// 최신 버전: 시트 자동 감지/생성 + POST/GET 듀얼 지원 + 완벽한 오류 방지
// ==========================================================================

// 1. 스프레드시트 객체 참조
// 스프레드시트 안에서 연 스크립트라면 자동으로 활성 시트를 참조합니다.
// 만약 독립형 스크립트라면 아래 따옴표 안에 스프레드시트 ID를 입력하세요.
const SPREADSHEET_ID = ""; 

function getSpreadsheet() {
  try {
    const active = SpreadsheetApp.getActiveSpreadsheet();
    if (active) return active;
  } catch(e) {}
  
  if (SPREADSHEET_ID) {
    try {
      return SpreadsheetApp.openById(SPREADSHEET_ID);
    } catch(e) {}
  }

  // 독립 스크립트인 경우 사용자의 구글 드라이브에서 첫 번째 스프레드시트 탐색
  try {
    const files = DriveApp.getFilesByType(MimeType.GOOGLE_SHEETS);
    if (files.hasNext()) {
      return SpreadsheetApp.open(files.next());
    }
  } catch(e) {}

  return null;
}

/**
 * [핵심 시트 헬퍼]
 * 'users' 시트가 있으면 가져오고, 없으면 첫 번째 기본 시트('시트1')를 'users'로 자동 변경하거나
 * 새 시트를 생성하여 헤더를 100% 자동으로 세팅합니다.
 * (어떤 환경에서도 'users 시트가 없습니다' 에러가 절대 발생하지 않습니다!)
 */
function getOrCreateUsersSheet() {
  const SS = getSpreadsheet();
  if (!SS) return null;

  let sheet = SS.getSheetByName('users');

  if (!sheet) {
    const sheets = SS.getSheets();
    // 시트가 하나 있고 첫 번째 시트가 비어있으면 users로 이름 변경
    if (sheets.length > 0 && sheets[0].getLastRow() <= 1 && sheets[0].getName() !== 'posts') {
      sheet = sheets[0];
      sheet.setName('users');
    } else {
      // 그렇지 않으면 새 시트 생성
      sheet = SS.insertSheet('users');
    }
  }

  // 1행에 헤더가 없으면 자동 작성
  if (sheet.getLastRow() === 0) {
    const headers = ['id', 'email', 'password', 'nickname', 'name', 'bio', 'avatar', 'interests', 'joinedAt'];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#3b82f6');
    headerRange.setFontColor('#ffffff');
    sheet.setFrozenRows(1);
  }

  return sheet;
}

/**
 * [수동 초기화 함수]
 * Apps Script 화면 상단에서 이 함수를 선택하고 [실행]을 누르면 즉시 시트가 생성됩니다.
 */
function setupUsersSheet() {
  const sheet = getOrCreateUsersSheet();
  if (sheet) {
    Logger.log("✅ 'users' 시트가 성공적으로 준비되었습니다! (시트 이름: " + sheet.getName() + ")");
  } else {
    Logger.log("❌ 스프레드시트를 찾을 수 없습니다. SPREADSHEET_ID를 확인해 주세요.");
  }
}

/**
 * ==========================================================================
 * POST 요청 처리 (메인 API 통신)
 * ==========================================================================
 */
function doPost(e) {
  let responseData = { success: false, message: '알 수 없는 요청입니다.' };

  try {
    if (!e || !e.postData || !e.postData.contents) {
      return createJsonResponse({ success: false, message: '요청 본문(body)이 비어 있습니다.' });
    }

    const request = JSON.parse(e.postData.contents);
    const action = request.action;
    const data = request.data || {};

    const sheet = getOrCreateUsersSheet();
    if (!sheet) {
      return createJsonResponse({ 
        success: false, 
        message: '스프레드시트를 연결할 수 없습니다. SPREADSHEET_ID 변수를 확인해 주세요.' 
      });
    }

    if (action === 'signup') {
      responseData = processSignup(sheet, data);
    } else if (action === 'login') {
      responseData = processLogin(sheet, data);
    } else {
      responseData = { success: false, message: '지원하지 않는 action: ' + action };
    }

  } catch (error) {
    responseData = {
      success: false,
      message: '서버 에러 발생: ' + error.toString()
    };
  }

  return createJsonResponse(responseData);
}

/**
 * ==========================================================================
 * GET 요청 처리 (서버 헬스체크 및 URL 쿼리스트링 지원)
 * ==========================================================================
 */
function doGet(e) {
  // 1. 파라미터가 없으면 헬스체크 응답
  if (!e || !e.parameter || !e.parameter.action) {
    return createJsonResponse({
      status: 'ONLINE',
      service: 'DevLog Auth API',
      time: new Date().toISOString(),
      message: '회원가입/로그인 API 서버가 정상 작동 중입니다.'
    });
  }

  // 2. GET 방식으로도 signup/login 동작 가능 (CORS 회피용 백업)
  const action = e.parameter.action;
  const sheet = getOrCreateUsersSheet();
  if (!sheet) {
    return createJsonResponse({ success: false, message: '스프레드시트를 찾을 수 없습니다.' });
  }

  let responseData = { success: false };
  if (action === 'signup') {
    responseData = processSignup(sheet, e.parameter);
  } else if (action === 'login') {
    responseData = processLogin(sheet, e.parameter);
  } else if (action === 'getUsers') {
    const users = getAllUsersData(sheet).map(u => {
      const copy = { ...u };
      delete copy.password;
      return copy;
    });
    responseData = { success: true, users: users };
  }

  return createJsonResponse(responseData);
}

/**
 * ==========================================================================
 * 회원가입 비즈니스 로직
 * ==========================================================================
 */
function processSignup(sheet, data) {
  const email = (data.email || '').trim().toLowerCase();
  const password = data.password;
  const nickname = (data.nickname || '').trim();
  const name = (data.name || nickname).trim();
  const bio = data.bio || '안녕하세요! 반갑습니다.';
  const avatar = data.avatar || 'assets/images/profile.jpg';
  const interests = typeof data.interests === 'string' 
    ? data.interests 
    : JSON.stringify(data.interests || ['Web Development']);

  // 유효성 검사
  if (!email || !password || !nickname) {
    return { success: false, message: '이메일, 비밀번호, 닉네임은 필수 입력 항목입니다.' };
  }

  const allUsers = getAllUsersData(sheet);

  // 이메일 중복 확인
  if (allUsers.some(u => String(u.email).toLowerCase() === email)) {
    return { success: false, message: '이미 등록된 이메일 주소입니다.' };
  }

  // 닉네임 중복 확인
  if (allUsers.some(u => String(u.nickname).toLowerCase() === nickname.toLowerCase())) {
    return { success: false, message: '이미 사용 중인 닉네임입니다.' };
  }

  // 새 회원 행 추가
  const newId = 'user_' + Date.now();
  const joinedAt = Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyy-MM-dd HH:mm');

  sheet.appendRow([
    newId,
    email,
    password,
    nickname,
    name,
    bio,
    avatar,
    interests,
    joinedAt
  ]);

  let parsedInterests = ['Web Development'];
  try {
    parsedInterests = typeof data.interests === 'object' ? data.interests : JSON.parse(interests);
  } catch(e) {}

  return {
    success: true,
    message: '회원가입이 완료되었습니다!',
    user: {
      id: newId,
      email: email,
      nickname: nickname,
      name: name,
      bio: bio,
      avatar: avatar,
      interests: parsedInterests,
      joinedAt: joinedAt
    }
  };
}

/**
 * ==========================================================================
 * 로그인 비즈니스 로직
 * ==========================================================================
 */
function processLogin(sheet, data) {
  const email = (data.email || '').trim().toLowerCase();
  const password = data.password;

  if (!email || !password) {
    return { success: false, message: '이메일과 비밀번호를 모두 입력해 주세요.' };
  }

  const allUsers = getAllUsersData(sheet);
  const matchedUser = allUsers.find(u => 
    String(u.email).toLowerCase() === email && String(u.password) === String(password)
  );

  if (matchedUser) {
    const userSession = { ...matchedUser };
    delete userSession.password;

    try {
      userSession.interests = JSON.parse(userSession.interests);
    } catch(err) {
      userSession.interests = ['Web Development'];
    }

    return {
      success: true,
      message: `로그인 성공! 환영합니다, ${userSession.nickname}님.`,
      user: userSession
    };
  } else {
    return {
      success: false,
      message: '이메일 또는 비밀번호가 일치하지 않습니다.'
    };
  }
}

// 헬퍼: 시트 데이터를 객체 배열로 파싱
function getAllUsersData(sheet) {
  const dataRange = sheet.getDataRange();
  const rows = dataRange.getValues();
  if (rows.length <= 1) return [];

  const headers = rows[0];
  const users = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const user = {};
    headers.forEach((h, idx) => {
      user[h] = row[idx];
    });
    users.push(user);
  }
  return users;
}

// 헬퍼: JSON 응답 생성
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
