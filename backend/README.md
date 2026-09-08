# 📊 DevLog Google Sheets Backend

구글 스프레드시트를 데이터베이스로 사용하는 Google Apps Script(GAS) 백엔드 코드입니다.

## 📁 파일 구성
- **[`Code.gs`](./Code.gs)** / **[`google-apps-script.js`](./google-apps-script.js)**: 구글 앱 스크립트에 복사하여 붙여넣는 백엔드 전체 코드

---

## 🚀 적용 및 배포 방법

### 1단계: 코드 적용
1. 연동할 **Google 스프레드시트**를 엽니다.
2. 상단 메뉴에서 **[확장 프로그램] → [Apps Script]**를 클릭합니다.
3. 기존 내용을 지우고, [`Code.gs`](./Code.gs) 파일의 전체 내용을 복사하여 붙여넣고 **저장(`Ctrl + S`)**합니다.

### 2단계: 시트 자동 생성 (클릭 1회)
1. Apps Script 상단 함수 드롭다운에서 **`setupUsersSheet`**를 선택합니다.
2. 바로 옆의 **`[실행]`** 버튼을 누릅니다.
3. 구글 스프레드시트에 파란색 헤더의 **`users`** 시트가 자동으로 생성됩니다.

### 3단계: 웹 앱(Web App) 배포
1. Apps Script 우측 상단의 파란색 **`[배포]`** → **`[새 배포]`**를 클릭합니다.
2. 왼쪽 톱니바퀴 ⚙️ 아이콘 → **`웹 앱`** 선택
3. 다음 옵션 설정:
   - **설명**: `DevLog Auth v1`
   - **다음 사용자로 실행**: `나 (내 계정)`
   - **액세스할 수 있는 사용자**: **`모든 사용자 (Anyone)`** *(필수!)*
4. 하단 **`[배포]`** 클릭 → 계정 액세스 허용 진행
5. 발급된 **웹 앱 URL** (`https://script.google.com/macros/s/.../exec`) 복사!

### 4단계: 블로그에 URL 연동
- 발급받은 URL을 `js/blog-core.js`의 `GAS_API_URL` 변수에 넣거나, 브라우저 콘솔에서 `BlogCore.setGasUrl('발급받은_URL')`을 실행하시면 스프레드시트와 실시간 연동됩니다.
