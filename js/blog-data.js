/**
 * Blog Initial Data
 * 블로그 초기 게시글 및 데모 사용자 데이터
 */

const initialBlogData = {
  // 데모 계정 데이터
  users: [
    {
      id: "user_admin",
      email: "hong@example.com",
      password: "password123",
      name: "홍길동",
      nickname: "DevGildong",
      bio: "기록하고 공유하며 성장하는 프론트엔드 개발자입니다. 모던 웹 기술과 클린 아키텍처에 관심이 많습니다.",
      avatar: "assets/images/profile.jpg",
      role: "admin",
      joinedAt: "2024-01-15",
      github: "https://github.com",
      blog: "https://velog.io",
      interests: ["React", "TypeScript", "Next.js", "CSS/UI", "Web Performance"]
    },
    {
      id: "user_demo",
      email: "guest@example.com",
      password: "password123",
      name: "김방문",
      nickname: "코딩꿈나무",
      bio: "안녕하세요! 개발 공부를 시작한 열정 가득한 주니어입니다.",
      avatar: "assets/images/강아지.jpg",
      role: "user",
      joinedAt: "2024-03-01",
      github: "https://github.com",
      blog: "",
      interests: ["JavaScript", "HTML/CSS", "Python"]
    }
  ],

  // 초기 게시글 데이터
  posts: [
    {
      id: 1,
      title: "React 19 핵심 변화 총정리: useActionState와 Server Actions 살펴보기",
      category: "frontend",
      categoryName: "프론트엔드",
      summary: "React 19 릴리즈에 포함된 새로운 기능들과 액션 훅(useActionState, useOptimistic, useFormStatus)을 실무 코드 예제와 함께 살펴봅니다.",
      coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1200&auto=format&fit=crop",
      authorId: "user_admin",
      authorName: "홍길동",
      authorAvatar: "assets/images/profile.jpg",
      createdAt: "2024-04-10 14:20",
      readTime: "5분",
      views: 342,
      likes: 28,
      tags: ["React", "React19", "JavaScript", "Frontend"],
      featured: true,
      content: `## 🚀 React 19의 새로운 패러다임

React 19는 비동기 작업 처리와 상태 관리를 한층 더 우아하게 만들어주는 많은 기능들을 도입했습니다. 그동안 비동기 데이터 패칭이나 폼 제출 시 매번 반복해서 작성해야 했던 \`pending\`, \`error\`, \`data\` 상태 관리가 훨씬 간단해졌습니다.

### 1. useActionState의 등장
과거에는 폼 제출 시 \`isPending\`이나 에러 처리를 수동 \`useState\`로 관리했습니다:

\`\`\`javascript
// 기존 방식
const [isPending, setIsPending] = useState(false);
const [error, setError] = useState(null);

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsPending(true);
  try {
    await updateProfile();
  } catch (err) {
    setError(err);
  } finally {
    setIsPending(false);
  }
};
\`\`\`

하지만 React 19의 \`useActionState\`를 사용하면 다음과 같이 단 몇 줄로 비동기 상태를 통합 관리할 수 있습니다:

\`\`\`javascript
// React 19 방식
const [state, formAction, isPending] = useActionState(async (prevState, formData) => {
  const result = await updateProfile(formData);
  return result;
}, null);
\`\`\`

### 2. useOptimistic으로 구현하는 즉각적인 UI 반응
사용자가 버튼을 눌렀을 때 서버 응답을 기다리지 않고 화면을 즉시 갱신하는 '낙관적 업데이트(Optimistic Update)'를 기본 훅으로 지원합니다.
이를 통해 사용자 경험(UX)을 극대화할 수 있습니다.

### 3. Server Components와 Client Components의 자연스러운 결합
서버 액션(Server Actions)을 사용하면 별도의 API 라우트를 일일이 작성하지 않고도 클라이언트와 서버 함수 간의 통신이 가능해집니다.

---

### 💡 결론
React 19는 보일러플레이트 코드를 줄이고 웹 성능과 개발자 경험(DX)을 크게 끌어올렸습니다. 지금 진행 중인 프로젝트에서도 점진적으로 도입해보는 것을 추천합니다!`
    },
    {
      id: 2,
      title: "모던 CSS 레이아웃 마스터: Flexbox vs Grid 실무 비교 가이드",
      category: "css",
      categoryName: "CSS & UI",
      summary: "1차원 레이아웃의 최강자 Flexbox와 2차원 그리드 시스템 Grid의 명확한 차이점과 실무에서 실패 없는 선택 기준을 제시합니다.",
      coverImage: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop",
      authorId: "user_admin",
      authorName: "홍길동",
      authorAvatar: "assets/images/profile.jpg",
      createdAt: "2024-04-05 09:30",
      readTime: "7분",
      views: 520,
      likes: 45,
      tags: ["CSS", "Flexbox", "CSSGrid", "WebDesign"],
      featured: true,
      content: `## 🎨 레이아웃 전쟁: Flexbox vs CSS Grid

많은 프론트엔드 개발자들이 "언제 Flexbox를 쓰고 언제 Grid를 써야 할까?"라는 질문을 자주 던집니다. 정답은 둘 중 하나를 택하는 것이 아니라 **상황에 맞춰 조화롭게 사용하는 것**입니다.

### 1. Flexbox: 1차원(One-Dimensional) 레이아웃
Flexbox는 가로(Row) 또는 세로(Column) 중 **하나의 축**을 기준으로 자식 요소들을 배치할 때 가장 효과적입니다.

- **주요 활용처**:
  - 네비게이션 바 (Navbar 아이템 정렬)
  - 카드 내부의 텍스트와 버튼 수직 정렬
  - 뱃지나 태그들의 자동 줄바꿈 (\`flex-wrap: wrap\`)

\`\`\`css
.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
\`\`\`

### 2. CSS Grid: 2차원(Two-Dimensional) 레이아웃
CSS Grid는 행(Row)과 열(Column)을 **동시에 제어**할 수 있는 강력한 시스템입니다. 전체 페이지의 대시보드나 불규칙한 카드 그리드를 구성할 때 진가를 발휘합니다.

\`\`\`css
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}
\`\`\`

### 3. 실무 추천 패턴
- **전체 페이지 뼈대(Page Skeleton)**: CSS Grid 활용 (Header, Sidebar, Main, Footer 영역 분할)
- **컴포넌트 내부(Component Internal UI)**: Flexbox 활용 (아이콘과 텍스트 정렬, 버튼 그룹 등)

> 실무 팁: \`gap\` 속성은 이제 Flexbox에서도 완벽히 지원되므로 불필요한 \`margin\` 트릭 대신 적극 활용하세요!`
    },
    {
      id: 3,
      title: "웹 성능 최적화 실전: Core Web Vitals 올 그린(Green) 달성기",
      category: "performance",
      categoryName: "성능 최적화",
      summary: "LCP, FID/INP, CLS 지표를 분석하고 이미지 최적화, 폰트 로딩 전략, 번들 다이어트를 통해 사이트 로딩 속도를 3배 개선한 실제 사례입니다.",
      coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
      authorId: "user_admin",
      authorName: "홍길동",
      authorAvatar: "assets/images/profile.jpg",
      createdAt: "2024-03-28 17:45",
      readTime: "6분",
      views: 680,
      likes: 62,
      tags: ["Performance", "CoreWebVitals", "Lighthouse", "WebDev"],
      featured: true,
      content: `## ⚡ 성능은 곧 사용자 경험이자 전환율입니다

Google Lighthouse 측정 결과가 빨간색으로 가득 찼던 프로젝트를 점수 98점 올 그린(Green)으로 전환하며 적용했던 핵심 테크닉들을 공유합니다.

### 1. LCP (Largest Contentful Paint) 개선
가장 큰 콘텐츠가 화면에 나타나는 시간을 줄이기 위해 다음 조치를 취했습니다:
- **이미지 WebP/AVIF 포맷 변환 및 반응형 \`srcset\` 제공**
- 히어로 이미지에 \`fetchpriority="high"\` 부여하여 우선 순위 패칭
- 불필요한 렌더 블로킹 CSS/JS 최소화

### 2. CLS (Cumulative Layout Shift) 0점 만들기
페이지 로딩 중 요소가 덜컥거리며 위치가 이동하는 현상은 사용자에게 큰 불편을 줍니다.
- 모든 이미지와 영상 태그에 명시적인 \`width\`와 \`height\` 지정
- 동적으로 삽입되는 광고나 배너 영역에 사전 스켈레톤(Skeleton UI) 박스 할당

\`\`\`css
/* 레이아웃 시프트 방지 */
.image-box {
  aspect-ratio: 16 / 9;
  background-color: var(--bg-alt);
}
\`\`\`

### 3. 웹 폰트 최적화
- \`font-display: swap;\` 적용으로 텍스트 깜빡임 방지
- WOFF2 형식 사용 및 자주 쓰이는 한글 서브셋(Subset)만 로드하여 폰트 파일 용량을 70% 압축

성능 측정은 일회성이 아니라 CI/CD 파이프라인과 연계한 지속적인 모니터링이 필수적입니다!`
    },
    {
      id: 4,
      title: "초보 개발자를 위한 클린 코드와 리팩토링 5가지 핵심 원칙",
      category: "devlife",
      categoryName: "개발 이야기",
      summary: "동작만 하는 코드에서 벗어나 '읽기 쉽고 유지보수하기 쉬운 코드'를 작성하는 실천적인 팁과 네이밍 전략을 소개합니다.",
      coverImage: "https://images.unsplash.com/photo-1516116211227-bbc1545ec19e?q=80&w=1200&auto=format&fit=crop",
      authorId: "user_admin",
      authorName: "홍길동",
      authorAvatar: "assets/images/profile.jpg",
      createdAt: "2024-03-20 11:15",
      readTime: "4분",
      views: 410,
      likes: 39,
      tags: ["CleanCode", "Refactoring", "Programming", "BestPractices"],
      featured: false,
      content: `## 📖 코드는 작성하는 시간보다 읽히는 시간이 10배 길다

누구나 컴퓨터가 이해할 수 있는 코드는 작성할 수 있습니다. 하지만 좋은 프로그래머는 **인간이 이해할 수 있는 코드**를 작성합니다.

### 원칙 1: 명확한 의도를 담은 변수와 함수 이름
- \`let d;\` ❌ -> \`let daysSinceLastVisit;\` ⭕
- \`function check(u)\` ❌ -> \`function isUserEligibleForDiscount(user)\` ⭕

### 원칙 2: 하나의 함수는 오직 한 가지 일만 수행
함수의 길이가 20줄을 넘어가고 있다면, 그 함수가 여러 책임을 동시에 떠안고 있을 확률이 높습니다. 함수를 작은 단위로 쪼개세요.

### 원칙 3: Early Return으로 중첩 줄이기
불필요한 \`if-else\` 중첩(지옥의 피라미드)을 피하고 조건에 맞지 않으면 함수 앞부분에서 즉시 반환(Early Return)하세요.

\`\`\`javascript
// Before
function processUser(user) {
  if (user) {
    if (user.isActive) {
      if (user.hasPermission) {
        return doAction();
      }
    }
  }
  return null;
}

// After: 깔끔한 가드 클로즈
function processUser(user) {
  if (!user || !user.isActive || !user.hasPermission) return null;
  return doAction();
}
\`\`\`

스스로 작성한 코드도 3개월 뒤의 나에게는 남의 코드처럼 느껴집니다. 배려하는 마음으로 코드를 작성해 봅시다!`
    },
    {
      id: 5,
      title: "REST API vs GraphQL: 백엔드-프론트엔드 통신 아키텍처 비교",
      category: "backend",
      categoryName: "백엔드 & CS",
      summary: "REST API의 Over-fetching/Under-fetching 문제와 이를 해결하기 위한 GraphQL의 장단점, 프로젝트 규모에 따른 선택 기준을 정리합니다.",
      coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop",
      authorId: "user_admin",
      authorName: "홍길동",
      authorAvatar: "assets/images/profile.jpg",
      createdAt: "2024-03-12 16:00",
      readTime: "8분",
      views: 495,
      likes: 33,
      tags: ["API", "REST", "GraphQL", "Backend", "Architecture"],
      featured: false,
      content: `## 🌐 클라이언트와 서버의 대화 방식

웹 서비스를 만들 때 클라이언트와 서버 사이의 데이터 통신 규약은 시스템 전체의 유연성을 결정짓습니다.

### 1. REST API의 장점과 한계
REST는 가장 널리 쓰이며 단순하고 HTTP 캐싱을 그대로 활용할 수 있다는 엄청난 장점이 있습니다.
하지만 클라이언트의 요구사항이 다양해지면 다음과 같은 문제가 발생합니다:
- **Over-fetching**: 사용자 닉네임 하나만 필요한데 사용자 전체 객체(주소, 결제정보 등)가 함께 날아옴
- **Under-fetching**: 한 화면을 그리기 위해 \`/users\`, \`/posts\`, \`/comments\` 등 3번 이상의 API 호출 필요

### 2. GraphQL의 해결책
GraphQL은 클라이언트가 **정확히 필요한 필드만 명시하여 요청**할 수 있게 합니다.

\`\`\`graphql
query GetPostDetails {
  post(id: 1) {
    title
    createdAt
    author {
      nickname
      avatar
    }
  }
}
\`\`\`

### 3. 그렇다면 무엇을 골라야 할까?
- **REST API 추천**: 데이터 구조가 정형화되어 있고, HTTP 캐싱이 중요하며, 팀에 GraphQL 러닝 커브가 부담스러운 경우
- **GraphQL 추천**: 모바일/웹 등 다양한 클라이언트가 존재하며 복잡한 관계형 엔티티를 화면마다 다르게 조합해야 하는 경우`
    },
    {
      id: 6,
      title: "비전공자 개발자의 1년 차 회고: 실패를 통해 배운 성장 마인드셋",
      category: "devlife",
      categoryName: "개발 이야기",
      summary: "처음 코드를 접했던 막막함부터 실무 프로덕트를 배포하고 협업하며 느꼈던 감정, 그리고 지속 가능한 성장을 위한 루틴을 나눕니다.",
      coverImage: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop",
      authorId: "user_admin",
      authorName: "홍길동",
      authorAvatar: "assets/images/profile.jpg",
      createdAt: "2024-02-28 20:10",
      readTime: "5분",
      views: 790,
      likes: 85,
      tags: ["Retrospective", "DevLife", "Career", "Mindset"],
      featured: false,
      content: `## 🌱 돌아보며: 지난 1년의 여정

개발 공부를 시작했을 때 가장 힘들었던 것은 "내가 과연 프로그래머로 밥벌이를 할 수 있을까?"라는 막연한 불안감이었습니다. 하지만 1년이 지난 지금, 저는 스스로의 힘으로 서비스를 만들고 팀원들과 기술적인 토론을 즐기고 있습니다.

### 내가 실천했던 세 가지 성장 습관
1. **작은 단위로 매일 만들기 (Show Your Work)**
   - 책이나 강의를 수동적으로 보기만 하는 것은 실력이 늘지 않습니다. 아주 작은 투두리스트나 날씨 위젯이라도 직접 키보드를 두드리며 만들어보았습니다.
2. **기술 블로그에 '문제 해결 과정' 기록하기**
   - 단순히 문법 정리가 아니라 "어떤 에러를 만났고, 왜 발생했으며, 어떻게 해결했는가"를 기록했습니다. 이 기록들이 포트폴리오 면접에서 가장 큰 무기가 되었습니다.
3. **모르는 것을 부끄러워하지 않고 질문하기**
   - 모르는 것을 숨기는 것보다 정중하고 구체적으로 질문하여 빠르게 피드백을 받는 것이 팀 전체의 생산성을 높이는 길임을 배웠습니다.

앞으로도 배움의 즐거움을 잃지 않고, 동료들에게 믿음을 주는 든든한 개발자로 성장해 나가겠습니다!`
    }
  ],

  // 초기 댓글 데이터
  comments: [
    {
      id: 101,
      postId: 1,
      userId: "user_demo",
      userName: "김방문",
      userAvatar: "assets/images/강아지.jpg",
      createdAt: "2024-04-11 10:15",
      content: "React 19에서 비동기 처리가 이렇게 편리해지다니 정말 기대됩니다! 예제 코드 덕분에 useActionState 개념이 쏙쏙 들어오네요."
    },
    {
      id: 102,
      postId: 1,
      userId: "user_admin",
      userName: "홍길동",
      userAvatar: "assets/images/profile.jpg",
      createdAt: "2024-04-11 11:30",
      content: "도움이 되셨다니 기쁩니다! 실무 프로젝트에 적용해 보시고 궁금한 점 있으시면 언제든 댓글 남겨주세요 :)"
    },
    {
      id: 103,
      postId: 2,
      userId: "user_demo",
      userName: "김방문",
      userAvatar: "assets/images/강아지.jpg",
      createdAt: "2024-04-06 14:00",
      content: "Grid와 Flexbox의 용도 구분이 항상 헷갈렸는데 1차원/2차원 관점으로 설명해주셔서 깔끔하게 정리되었습니다."
    },
    {
      id: 104,
      postId: 3,
      userId: "user_demo",
      userName: "김방문",
      userAvatar: "assets/images/강아지.jpg",
      createdAt: "2024-03-30 08:45",
      content: "저희 팀 서비스도 CLS 점수가 나빠서 고민이었는데 이미지 aspect-ratio 팁 바로 적용해보겠습니다. 감사합니다!"
    }
  ]
};

// 전역 내보내기
window.initialBlogData = initialBlogData;
