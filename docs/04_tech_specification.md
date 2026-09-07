# 04. 기술 구현 명세서 (Technical Specification)

## 1. 프론트엔드 파일 구조 가이드

`frontend/` 폴더 내에 다음과 같이 파일을 구성합니다:

```text
frontend/
├── index.html            # 메인 단일 페이지 마크업
├── css/
│   ├── style.css         # 전체 통합 스타일 (리셋, 변수, 컴포넌트)
│   └── responsive.css    # 미디어 쿼리 및 반응형 스타일 (분리 시)
├── js/
│   ├── main.js           # 초기화 및 이벤트 리스너 통합
│   ├── theme.js          # 다크/라이트 모드 토글 및 localStorage 관리
│   ├── projects.js       # 프로젝트 데이터 렌더링 및 필터링
│   └── scroll.js         # 스크롤 애니메이션 및 액티브 네비게이션 감지
└── assets/
    ├── images/           # 프로필 사진, 프로젝트 썸네일, 파비콘
    └── icons/            # SVG 아이콘
```

---

## 2. JavaScript 주요 기능 구현 명세

### 2.1. 다크 모드 (Theme Toggle)
- **저장소**: `localStorage.getItem('theme')` 확인
- **시스템 선호도**: `window.matchMedia('(prefers-color-scheme: dark)')` 감지
- **동작**:
  1. 페이지 로드 시 기존 저장 테마 or 시스템 테마 적용 (`html[data-theme="dark|light"]`)
  2. 토글 버튼 클릭 시 테마 전환 및 아이콘(🌙/☀️) 교체, `localStorage`에 값 저장

### 2.2. 반응형 햄버거 메뉴 (Mobile Navigation)
- 모바일 해상도에서 햄버거 버튼 클릭 시 네비게이션 드롭다운 메뉴 토글 (`.is-active` 클래스)
- 메뉴 링크 클릭 시 모바일 메뉴 자동 닫힘

### 2.3. 부드러운 스크롤 & 활성 메뉴 하이라이트 (Smooth Scroll & Scroll Spy)
- 네비게이션 링크 클릭 시 `target.scrollIntoView({ behavior: 'smooth' })`
- `IntersectionObserver`를 활용하여 현재 뷰포트에 위치한 섹션의 네비게이션 링크에 `.active` 클래스 부여

### 2.4. 스크롤 등장 애니메이션 (Scroll Reveal)
- 각 섹션 또는 카드에 `.reveal` 클래스 부여
- `IntersectionObserver`로 요소가 화면 15% 이상 보일 때 `.visible` 클래스 추가 (CSS `opacity` & `transform` 애니메이션 실행)

### 2.5. 프로젝트 동적 렌더링 및 필터 (Projects Data & Filter)
- 프로젝트 목록을 JS 객체 배열(`Array<Object>`)로 관리하여 유지보수성 향상:
  ```javascript
  const projectsData = [
    {
      id: 1,
      title: "프로젝트 명",
      category: "frontend",
      description: "프로젝트 핵심 설명",
      tags: ["HTML", "CSS", "JavaScript"],
      image: "assets/images/project1.jpg",
      demoUrl: "https://...",
      githubUrl: "https://github.com/..."
    },
    // ...
  ];
  ```
- 필터 버튼(`All`, `Frontend`, `Fullstack` 등) 클릭 시 카테고리별 필터링 후 렌더링

### 2.6. 문의 폼 유효성 검사 (Contact Form Validation)
- 이름, 이메일, 메시지 입력값 검증 (이메일 정규식 검사)
- 필수 항목 누락 시 에러 메시지 노출 및 전송 피드백(Alert 또는 Toast 알림)
