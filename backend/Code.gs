// ==========================================================================
// DevLog 블로그 통합 백엔드 API (Google Apps Script)
// 기능: 회원가입, 로그인, 게시글 등록/동기화, 댓글 등록, 3종 시트 자동 감지/생성
// ==========================================================================

// 1. 스프레드시트 객체 참조
// 구글 스프레드시트 상단 [확장 프로그램] → [Apps Script]에서 생성한 경우 자동으로 활성 시트를 인식합니다.
// 만약 구글 드라이브에서 직접 만든 '독립형 스크립트'라면 따옴표 안에 스프레드시트 ID를 입력하세요.
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

  // 독립 스크립트인 경우 사용자의 구글 드라이브에서 첫 번째 스프레드시트 자동 탐색
  try {
    const files = DriveApp.getFilesByType(MimeType.GOOGLE_SHEETS);
    if (files.hasNext()) {
      return SpreadsheetApp.open(files.next());
    }
  } catch(e) {}

  return null;
}

/**
 * [시트 헬퍼 1] 'users' (회원) 시트 자동 감지 및 헤더 생성
 */
function getOrCreateUsersSheet() {
  const SS = getSpreadsheet();
  if (!SS) return null;

  let sheet = SS.getSheetByName('users');
  if (!sheet) {
    const sheets = SS.getSheets();
    // 첫 번째 기본 시트가 비어있고 다른 용도가 아니면 users로 이름 변경
    if (sheets.length === 1 && sheets[0].getLastRow() <= 1 && sheets[0].getName() !== 'posts' && sheets[0].getName() !== 'comments') {
      sheet = sheets[0];
      sheet.setName('users');
    } else {
      sheet = SS.insertSheet('users');
    }
  }

  // 1행에 헤더가 없으면 자동 작성 및 스타일링
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
 * [시트 헬퍼 2] 'posts' (게시글) 시트 자동 감지 및 헤더 생성
 */
function getOrCreatePostsSheet() {
  const SS = getSpreadsheet();
  if (!SS) return null;

  let sheet = SS.getSheetByName('posts');
  if (!sheet) {
    sheet = SS.insertSheet('posts');
  }

  if (sheet.getLastRow() === 0) {
    const headers = [
      'id', 'title', 'category', 'categoryName', 'summary', 
      'coverImage', 'authorId', 'authorName', 'authorAvatar', 
      'createdAt', 'readTime', 'views', 'likes', 'tags', 'featured', 'content'
    ];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#10b981');
    headerRange.setFontColor('#ffffff');
    sheet.setFrozenRows(1);
  }

  return sheet;
}

/**
 * [시트 헬퍼 3] 'comments' (댓글) 시트 자동 감지 및 헤더 생성
 */
function getOrCreateCommentsSheet() {
  const SS = getSpreadsheet();
  if (!SS) return null;

  let sheet = SS.getSheetByName('comments');
  if (!sheet) {
    sheet = SS.insertSheet('comments');
  }

  if (sheet.getLastRow() === 0) {
    const headers = ['id', 'postId', 'userId', 'userName', 'userAvatar', 'createdAt', 'content'];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#8b5cf6');
    headerRange.setFontColor('#ffffff');
    sheet.setFrozenRows(1);
  }

  return sheet;
}

/**
 * [수동 전체 초기화 함수]
 * Apps Script 상단에서 이 함수를 선택하고 [실행]하면 3개 시트(users, posts, comments)가 즉시 자동 생성됩니다.
 */
function setupAllSheets() {
  const u = getOrCreateUsersSheet();
  const p = getOrCreatePostsSheet();
  const c = getOrCreateCommentsSheet();
  Logger.log("✅ 시트 준비 완료 - users: " + (u ? "OK" : "실패") + ", posts: " + (p ? "OK" : "실패") + ", comments: " + (c ? "OK" : "실패"));
}

function setupUsersSheet() {
  setupAllSheets();
}

/**
 * ==========================================================================
 * POST 요청 처리 (메인 API 통신: 회원가입, 로그인, 글 등록, 댓글 등록)
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

    if (action === 'signup') {
      const sheet = getOrCreateUsersSheet();
      if (!sheet) return createJsonResponse({ success: false, message: '스프레드시트를 연결할 수 없습니다.' });
      responseData = processSignup(sheet, data);

    } else if (action === 'login') {
      const sheet = getOrCreateUsersSheet();
      if (!sheet) return createJsonResponse({ success: false, message: '스프레드시트를 연결할 수 없습니다.' });
      responseData = processLogin(sheet, data);

    } else if (action === 'createPost') {
      const sheet = getOrCreatePostsSheet();
      if (!sheet) return createJsonResponse({ success: false, message: '스프레드시트를 연결할 수 없습니다.' });
      responseData = processCreatePost(sheet, data);

    } else if (action === 'addComment') {
      const sheet = getOrCreateCommentsSheet();
      if (!sheet) return createJsonResponse({ success: false, message: '스프레드시트를 연결할 수 없습니다.' });
      responseData = processAddComment(sheet, data);

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
 * GET 요청 처리 (서버 헬스체크 및 목록 조회)
 * ==========================================================================
 */
function doGet(e) {
  // 1. 파라미터가 없으면 헬스체크 응답
  if (!e || !e.parameter || !e.parameter.action) {
    return createJsonResponse({
      status: 'ONLINE',
      service: 'DevLog Integrated API',
      time: new Date().toISOString(),
      message: '회원가입/로그인/게시글/댓글 통합 백엔드 API가 정상 작동 중입니다.'
    });
  }

  const action = e.parameter.action;

  try {
    if (action === 'getPosts') {
      const sheet = getOrCreatePostsSheet();
      if (!sheet) return createJsonResponse({ success: false, message: '스프레드시트를 찾을 수 없습니다.' });
      const posts = getAllPostsData(sheet);
      return createJsonResponse({ success: true, data: posts });

    } else if (action === 'getUsers') {
      const sheet = getOrCreateUsersSheet();
      if (!sheet) return createJsonResponse({ success: false, message: '스프레드시트를 찾을 수 없습니다.' });
      const users = getAllUsersData(sheet).map(u => {
        const copy = { ...u };
        delete copy.password;
        return copy;
      });
      return createJsonResponse({ success: true, users: users });

    } else if (action === 'getComments') {
      const sheet = getOrCreateCommentsSheet();
      if (!sheet) return createJsonResponse({ success: false, message: '스프레드시트를 찾을 수 없습니다.' });
      const postId = e.parameter.postId;
      const comments = getAllCommentsData(sheet, postId);
      return createJsonResponse({ success: true, comments: comments });

    } else if (action === 'signup') {
      const sheet = getOrCreateUsersSheet();
      return createJsonResponse(processSignup(sheet, e.parameter));

    } else if (action === 'login') {
      const sheet = getOrCreateUsersSheet();
      return createJsonResponse(processLogin(sheet, e.parameter));
    }

    return createJsonResponse({ success: false, message: '지원하지 않는 GET action: ' + action });

  } catch (error) {
    return createJsonResponse({ success: false, message: '서버 오류 발생: ' + error.toString() });
  }
}

/**
 * ==========================================================================
 * 비즈니스 로직: 회원가입
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

  if (!email || !password || !nickname) {
    return { success: false, message: '이메일, 비밀번호, 닉네임은 필수 입력 항목입니다.' };
  }

  const allUsers = getAllUsersData(sheet);

  if (allUsers.some(u => String(u.email).toLowerCase() === email)) {
    return { success: false, message: '이미 등록된 이메일 주소입니다.' };
  }

  if (allUsers.some(u => String(u.nickname).toLowerCase() === nickname.toLowerCase())) {
    return { success: false, message: '이미 사용 중인 닉네임입니다.' };
  }

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
 * 비즈니스 로직: 로그인
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

/**
 * ==========================================================================
 * 비즈니스 로직: 게시글 작성/수정
 * ==========================================================================
 */
function processCreatePost(sheet, post) {
  if (!post || !post.title) {
    return { success: false, message: '게시글 제목이 누락되었습니다.' };
  }

  const id = post.id || Date.now();
  const title = post.title || '';
  const category = post.category || 'devlife';
  const categoryName = post.categoryName || '개발 이야기';
  const summary = post.summary || '';
  const coverImage = post.coverImage || '';
  const authorId = post.authorId || '';
  const authorName = post.authorName || '작성자';
  const authorAvatar = post.authorAvatar || 'assets/images/profile.jpg';
  const createdAt = post.createdAt || Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyy-MM-dd HH:mm');
  const readTime = post.readTime || '1분';
  const views = post.views || 0;
  const likes = post.likes || 0;
  const tags = Array.isArray(post.tags) ? JSON.stringify(post.tags) : (post.tags || '[]');
  const featured = post.featured ? 'true' : 'false';
  const content = post.content || '';

  const allPosts = getAllPostsData(sheet);
  const existingIdx = allPosts.findIndex(p => String(p.id) === String(id));

  const rowData = [
    id, title, category, categoryName, summary,
    coverImage, authorId, authorName, authorAvatar,
    createdAt, readTime, views, likes, tags, featured, content
  ];

  if (existingIdx !== -1) {
    // 이미 존재하는 글이면 해당 행 업데이트 (1행은 헤더)
    sheet.getRange(existingIdx + 2, 1, 1, rowData.length).setValues([rowData]);
  } else {
    sheet.appendRow(rowData);
  }

  return { 
    success: true, 
    message: '게시글이 성공적으로 스프레드시트에 저장되었습니다.', 
    post: post 
  };
}

/**
 * ==========================================================================
 * 비즈니스 로직: 댓글 작성
 * ==========================================================================
 */
function processAddComment(sheet, comment) {
  if (!comment || !comment.content) {
    return { success: false, message: '댓글 내용이 누락되었습니다.' };
  }

  const id = comment.id || Date.now();
  const postId = comment.postId || '';
  const userId = comment.userId || '';
  const userName = comment.userName || '방문자';
  const userAvatar = comment.userAvatar || 'assets/images/profile.jpg';
  const createdAt = comment.createdAt || Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyy-MM-dd HH:mm');
  const content = comment.content || '';

  sheet.appendRow([id, postId, userId, userName, userAvatar, createdAt, content]);
  return { 
    success: true, 
    message: '댓글이 성공적으로 스프레드시트에 저장되었습니다.', 
    comment: comment 
  };
}

/**
 * ==========================================================================
 * 헬퍼 함수들: 시트 데이터 파싱
 * ==========================================================================
 */
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

function getAllPostsData(sheet) {
  const dataRange = sheet.getDataRange();
  const rows = dataRange.getValues();
  if (rows.length <= 1) return [];

  const headers = rows[0];
  const posts = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const post = {};
    headers.forEach((h, idx) => {
      post[h] = row[idx];
    });

    if (typeof post.tags === 'string') {
      try {
        post.tags = JSON.parse(post.tags);
      } catch (e) {
        post.tags = post.tags ? post.tags.split(',').map(s => s.trim()) : [];
      }
    }
    post.featured = post.featured === true || post.featured === 'true';
    posts.push(post);
  }

  // 최신 등록 순으로 정렬
  posts.sort((a, b) => Number(b.id) - Number(a.id));
  return posts;
}

function getAllCommentsData(sheet, postId) {
  const dataRange = sheet.getDataRange();
  const rows = dataRange.getValues();
  if (rows.length <= 1) return [];

  const headers = rows[0];
  const comments = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const comment = {};
    headers.forEach((h, idx) => {
      comment[h] = row[idx];
    });
    if (!postId || String(comment.postId) === String(postId)) {
      comments.push(comment);
    }
  }
  return comments;
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
