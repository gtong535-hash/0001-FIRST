/**
 * Projects Data Source
 * 포트폴리오 프로젝트 데이터 정의
 */
const projectsData = [
  {
    id: 1,
    title: "반응형 E-Commerce 쇼핑몰 플랫폼",
    category: "fullstack",
    icon: "fa-solid fa-cart-shopping",
    description: "사용자 친화적인 장바구니, 상품 검색 및 실시간 결제 연동 기능을 갖춘 모던 풀스택 쇼핑몰 웹 애플리케이션입니다.",
    tags: ["React", "Node.js", "Express", "PostgreSQL", "Tailwind CSS"],
    features: [
      "JWT 기반 사용자 인증 및 권한 관리 (고객/관리자)",
      "카테고리별 상품 필터링, 정렬 및 실시간 검색 기능",
      "장바구니 상태 관리 및 모의 결제 API 연동",
      "관리자 대시보드를 통한 매출 및 재고 관리 통계"
    ],
    demoUrl: "https://example.com/demo1",
    githubUrl: "https://github.com/example/ecommerce-app"
  },
  {
    id: 2,
    title: "실시간 업무 협업 칸반 보드 (Task Kanban)",
    category: "frontend",
    icon: "fa-solid fa-list-check",
    description: "드래그 앤 드롭으로 작업을 손쉽게 관리하고 상태를 변경할 수 있는 직관적인 웹 기반 칸반 보드 툴입니다.",
    tags: ["HTML5", "CSS3", "JavaScript", "HTML Drag & Drop API"],
    features: [
      "HTML5 Drag and Drop API를 활용한 부드러운 카드 이동",
      "로컬 스토리지(localStorage)를 통한 작업 데이터 영구 저장",
      "우선순위(긴급/보통/낮음) 태그 지정 및 마감일 알림",
      "다크 모드 및 라이트 모드 테마 실시간 전환 지원"
    ],
    demoUrl: "https://example.com/demo2",
    githubUrl: "https://github.com/example/kanban-board"
  },
  {
    id: 3,
    title: "글로벌 날씨 예보 & 대기질 정보 웹 서비스",
    category: "javascript",
    icon: "fa-solid fa-cloud-sun-rain",
    description: "OpenWeatherMap API를 연동하여 전 세계 주요 도시의 실시간 날씨, 주간 예보, 대기질 지수를 시각화하여 제공합니다.",
    tags: ["JavaScript", "Async/Await", "Fetch API", "CSS Grid", "Chart.js"],
    features: [
      "Geolocation API를 활용한 사용자 현재 위치 날씨 자동 탐색",
      "24시간 시간별 기온 및 7일간의 주간 날씨 차트 시각화",
      "도시 검색 자동완성 및 최근 검색 기록 저장",
      "날씨 상태에 따른 동적 배경 애니메이션 효과"
    ],
    demoUrl: "https://example.com/demo3",
    githubUrl: "https://github.com/example/weather-app"
  },
  {
    id: 4,
    title: "개발자를 위한 마크다운 실시간 에디터",
    category: "frontend",
    icon: "fa-solid fa-code",
    description: "작성 중인 마크다운 텍스트를 실시간으로 렌더링하고 코드 하이라이팅과 HTML/PDF 내보내기를 지원하는 웹 에디터입니다.",
    tags: ["TypeScript", "React", "Prism.js", "Marked.js"],
    features: [
      "실시간 스플릿 뷰(Split View) 양방향 동기화 스크롤",
      "Prism.js를 통한 50여 개 언어 코드 문법 하이라이팅",
      "작성한 문서를 마크다운(.md), HTML, PDF로 즉시 다운로드",
      "단축키 지원 (굵게, 기울임, 링크, 표 삽입 등)"
    ],
    demoUrl: "https://example.com/demo4",
    githubUrl: "https://github.com/example/markdown-editor"
  },
  {
    id: 5,
    title: "개인 재정 및 가계부 관리 대시보드",
    category: "fullstack",
    icon: "fa-solid fa-chart-pie",
    description: "수입과 지출 내역을 기록하고 월별 소비 패턴을 다양한 그래프와 차트로 분석해 주는 금융 대시보드 웹 서비스입니다.",
    tags: ["Vue.js", "FastAPI", "Python", "Chart.js", "SQLite"],
    features: [
      "카테고리별 수입/지출 내역 등록 및 영수증 이미지 첨부",
      "월별, 분기별 소비 리포트 및 예산 초과 경고 알림",
      "CSV 및 Excel 데이터 가져오기 / 내보내기",
      "반응형 대시보드 차트 시각화"
    ],
    demoUrl: "https://example.com/demo5",
    githubUrl: "https://github.com/example/finance-tracker"
  },
  {
    id: 6,
    title: "인터랙티브 퀴즈 & 학습 플랫폼",
    category: "javascript",
    icon: "fa-solid fa-lightbulb",
    description: "다양한 주제의 퀴즈를 풀고 점수를 집계하여 오답 노트와 해설을 확인할 수 있는 인터랙티브 웹 애플리케이션입니다.",
    tags: ["HTML5", "CSS3", "Vanilla JavaScript", "Web Audio API"],
    features: [
      "타이머 카운트다운 및 정답/오답 음향 효과 (Web Audio API)",
      "난이도별 문항 랜덤 출제 및 진행률 프로그레스 바",
      "퀴즈 완료 후 오답 복습 및 상세 해설 제공",
      "최종 스코어 로컬 랭킹 시스템"
    ],
    demoUrl: "https://example.com/demo6",
    githubUrl: "https://github.com/example/quiz-app"
  }
];
