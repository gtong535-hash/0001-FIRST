// ==========================================================================
// DevLog 블로그 회원가입 & 로그인 백엔드 API (Google Apps Script)
// ==========================================================================

// 1. 스프레드시트 객체 참조 (스프레드시트 연동형은 자동 참조, 독립형 스크립트인 경우 ID 입력 지원)
const SPREADSHEET_ID = ""; // 필요한 경우 여기에 스프레드시트 ID를 입력하세요.

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
  // 스프레드시트가 직접 연결되지 않은 독립 스크립트인 경우 드라이브의 첫 번째 시트 탐색
  try {
    const files = DriveApp.getFilesByType(MimeType.GOOGLE_SHEETS);
    if (files.hasNext()) {
      return SpreadsheetApp.open(files.next());
    }
  } catch(e) {}
  return null;
}

/**
 * [스마트 시트 생성 함수]
 * users 시트가 없으면 자동으로 생성하고, 기본 시트1이 비어있으면 users로 자동 리네이밍합니다.
 */
function setupUsersSheet() {
  const SS = getSpreadsheet();
  if (!SS) {
    Logger.log("❌ 스프레드시트를 찾을 수 없습니다. SPREADSHEET_ID를 설정하거나 스프레드시트 내부에서 열어주세요.");
    return null;
  }

  let sheet = SS.getSheetByName('users');
  if (!sheet) {
    const sheets = SS.getSheets();
    // 시트1이 내용이 없으면 users로 이름 변경
    if (sheets.length > 0 && sheets[0].getLastRow() <= 1) {
      sheet = sheets[0];
      sheet.setName('users');
    } else {
      sheet = SS.insertSheet('users');
    }
  }

  // 1행 헤더가 비어있으면 자동 설정
  if (sheet.getLastRow() === 0) {
    const headers = ['id', 'email', 'password', 'nickname', 'name', 'bio', 'avatar', 'interests', 'joinedAt'];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#3b82f6');
    headerRange.setFontColor('#ffffff');
    sheet.setFrozenRows(1);
  }

  Logger.log("✅ 'users' 시트 준비 완료!");
  return sheet;
}

/**
 * ==========================================================================
 * POST 요청 처리 (회원가입 및 로그인)
 * ==========================================================================
 */
function doPost(e) {
  let responseData = { success: false, message: '알 수 없는 요청입니다.' };

  try {
    // 클라이언트에서 전달받은 JSON 파싱
    const request = JSON.parse(e.postData.contents);
    const action = request.action;
    const data = request.data || {};

    const SS = getSpreadsheet();
    if (!SS) {
      return createJsonResponse({ 
        success: false, 
        message: "스프레드시트를 연결할 수 없습니다. SPREADSHEET_ID를 확인해 주세요." 
      });
    }

    let sheet = SS.getSheetByName('users');
    if (!sheet) {
      // users 시트가 없으면 자동으로 생성 및 헤더 세팅
      setupUsersSheet();
      sheet = SS.getSheetByName('users');
    }

    const allUsers = getAllUsersData(sheet);

    // ---------------- [1] 회원가입 (signup) ----------------
    if (action === 'signup') {
      const email = (data.email || '').trim().toLowerCase();
      const password = data.password;
      const nickname = (data.nickname || '').trim();
      const name = (data.name || nickname).trim();
      const bio = data.bio || '안녕하세요! 반갑습니다.';
      const avatar = data.avatar || 'assets/images/profile.jpg';
      const interests = JSON.stringify(data.interests || ['Web Development']);

      // 1. 유효성 검사
      if (!email || !password || !nickname) {
        responseData = { success: false, message: '이메일, 비밀번호, 닉네임은 필수 항목입니다.' };
      }
      // 2. 이메일 중복 확인
      else if (allUsers.some(u => u.email.toLowerCase() === email)) {
        responseData = { success: false, message: '이미 등록된 이메일 주소입니다.' };
      }
      // 3. 닉네임 중복 확인
      else if (allUsers.some(u => u.nickname.toLowerCase() === nickname.toLowerCase())) {
        responseData = { success: false, message: '이미 사용 중인 닉네임입니다.' };
      }
      // 4. 회원 저장
      else {
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

        responseData = {
          success: true,
          message: '회원가입이 완료되었습니다!',
          user: {
            id: newId,
            email: email,
            nickname: nickname,
            name: name,
            bio: bio,
            avatar: avatar,
            interests: data.interests || ['Web Development'],
            joinedAt: joinedAt
          }
        };
      }
    }

    // ---------------- [2] 로그인 (login) ----------------
    else if (action === 'login') {
      const email = (data.email || '').trim().toLowerCase();
      const password = data.password;

      if (!email || !password) {
        responseData = { success: false, message: '이메일과 비밀번호를 모두 입력해 주세요.' };
      } else {
        // 일치하는 사용자 검색
        const matchedUser = allUsers.find(u => u.email.toLowerCase() === email && String(u.password) === String(password));

        if (matchedUser) {
          // 비밀번호는 클라이언트에 반환하지 않고 제외
          const userSession = { ...matchedUser };
          delete userSession.password;

          // 태그 JSON 파싱
          try {
            userSession.interests = JSON.parse(userSession.interests);
          } catch(err) {
            userSession.interests = [];
          }

          responseData = {
            success: true,
            message: `로그인 성공! 환영합니다, ${userSession.nickname}님.`,
            user: userSession
          };
        } else {
          responseData = {
            success: false,
            message: '이메일 또는 비밀번호가 일치하지 않습니다.'
          };
        }
      }
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
 * GET 요청 처리 (브라우저 주소창 접속 확인용 헬스체크)
 * ==========================================================================
 */
function doGet(e) {
  return createJsonResponse({
    status: 'ONLINE',
    service: 'DevLog Auth API',
    time: new Date().toISOString(),
    message: '회원가입/로그인 API 서버가 정상 작동 중입니다.'
  });
}

// 헬퍼 1: 시트에서 모든 유저 객체 배열 가져오기
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

// 헬퍼 2: JSON 응답 생성 (CORS 헤더 및 MimeType 설정)
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * ==========================================================================
 * [테스트용 함수] 배포 전에 Apps Script 안에서 직접 가상 테스트해보기
 * ==========================================================================
 */
function testLocalSignupAndLogin() {
  setupUsersSheet();

  // 1. 회원가입 테스트
  const mockSignupEvent = {
    postData: {
      contents: JSON.stringify({
        action: 'signup',
        data: {
          email: 'test@example.com',
          password: 'password123',
          nickname: '테스터',
          name: '김테스트',
          bio: '테스트 계정입니다.'
        }
      })
    }
  };
  const signupResult = doPost(mockSignupEvent);
  Logger.log('회원가입 결과: ' + signupResult.getContent());

  // 2. 로그인 테스트
  const mockLoginEvent = {
    postData: {
      contents: JSON.stringify({
        action: 'login',
        data: {
          email: 'test@example.com',
          password: 'password123'
        }
      })
    }
  };
  const loginResult = doPost(mockLoginEvent);
  Logger.log('로그인 결과: ' + loginResult.getContent());
}
