# 02. 페이지 구조 및 레이아웃 설계 (Page Structure & Wireframe)

## 1. 전체 DOM 계층 구조

```html
<!DOCTYPE html>
<html lang="ko" data-theme="light">
<head>...</head>
<body>
  <!-- 네비게이션 바 -->
  <header id="header" class="navbar">
    <div class="container nav-container">
      <a href="#hero" class="nav-logo">MyProfile.</a>
      <nav class="nav-menu">
        <ul class="nav-list">
          <li><a href="#about" class="nav-link">About</a></li>
          <li><a href="#skills" class="nav-link">Skills</a></li>
          <li><a href="#projects" class="nav-link">Projects</a></li>
          <li><a href="#experience" class="nav-link">Experience</a></li>
          <li><a href="#contact" class="nav-link">Contact</a></li>
        </ul>
      </nav>
      <div class="nav-actions">
        <button id="theme-toggle" class="btn-icon" aria-label="테마 변경">🌙</button>
        <button id="mobile-menu-btn" class="btn-hamburger" aria-label="메뉴 열기">☰</button>
      </div>
    </div>
  </header>

  <main>
    <!-- 1. Hero Section -->
    <section id="hero" class="section hero-section">
      <div class="container hero-container">
        <!-- 텍스트 소개 + CTA 버튼 + 프로필 이미지 -->
      </div>
    </section>

    <!-- 2. About Me Section -->
    <section id="about" class="section about-section">
      <div class="container">
        <h2 class="section-title">About Me</h2>
        <!-- 자기소개 본문 + 인적 사항 그리드 -->
      </div>
    </section>

    <!-- 3. Skills Section -->
    <section id="skills" class="section skills-section">
      <div class="container">
        <h2 class="section-title">Skills & Capabilities</h2>
        <!-- 기술 카테고리 카드 그리드 (Frontend, Backend, Tools 등) -->
      </div>
    </section>

    <!-- 4. Projects Section -->
    <section id="projects" class="section projects-section">
      <div class="container">
        <h2 class="section-title">Featured Projects</h2>
        <!-- 필터 버튼 (All, Web, Fullstack 등) + 프로젝트 카드 그리드 -->
      </div>
    </section>

    <!-- 5. Experience & Education Section -->
    <section id="experience" class="section experience-section">
      <div class="container">
        <h2 class="section-title">Experience & Education</h2>
        <!-- 타임라인 리스트 (경력, 수상, 교육) -->
      </div>
    </section>

    <!-- 6. Contact Section -->
    <section id="contact" class="section contact-section">
      <div class="container">
        <h2 class="section-title">Get In Touch</h2>
        <!-- 연락처 정보 + 문의 폼 -->
      </div>
    </section>
  </main>

  <!-- 푸터 -->
  <footer class="footer">
    <div class="container footer-container">
      <p>&copy; 2026 My Name. All rights reserved.</p>
    </div>
  </footer>

  <!-- 프로젝트 상세 모달 (선택 사항) -->
  <div id="project-modal" class="modal" aria-hidden="true">
    <div class="modal-overlay"></div>
    <div class="modal-content">
      <button class="modal-close">&times;</button>
      <div id="modal-body"></div>
    </div>
  </div>
</body>
</html>
```

---

## 2. 반응형 레이아웃 와이어프레임 (Visual Flow)

```
+-------------------------------------------------------------+
| [Logo]        About   Skills   Projects   Contact   [🌙] [☰] | (Navbar)
+-------------------------------------------------------------+
|                                                             |
|   👋 안녕하세요, [이름]입니다.             [ 프로필 ]       | (Hero)
|   세상을 바꾸는 프론트엔드 개발자          [ 이미지 ]       |
|   [이력서 다운로드]  [연락하기]                              |
|                                                             |
+-------------------------------------------------------------+
|                         About Me                            | (About)
|   [ 간단 소개 및 철학 ]        [ 기본 정보 (학력, 거주지 등) ] |
+-------------------------------------------------------------+
|                          Skills                             | (Skills)
|   +-----------------+  +-----------------+  +-------------+ |
|   | Frontend        |  | Backend / DB    |  | Tools & Coop| |
|   | HTML/CSS/JS/TS  |  | Node.js / SQL   |  | Git, Figma  | |
|   +-----------------+  +-----------------+  +-------------+ |
+-------------------------------------------------------------+
|                         Projects                            | (Projects)
|   [All] [Frontend] [Fullstack]                              |
|   +------------------+ +------------------+ +-------------+ |
|   | [Project 1 Img]  | | [Project 2 Img]  | | [Proj 3]    | |
|   | Title & TechTag  | | Title & TechTag  | | ...         | |
|   | [Demo] [GitHub]  | | [Demo] [GitHub]  | |             | |
|   +------------------+ +------------------+ +-------------+ |
+-------------------------------------------------------------+
|                        Experience                           | (Timeline)
|   ○ 2025 ~ 현재   : 회사/부트캠프/활동명 (상세 설명)           |
|   ○ 2023 ~ 2024   : 프로젝트/학위/자격증                      |
+-------------------------------------------------------------+
|                         Contact                             | (Contact)
|   [ Email / Phone / SNS ]   |   [ 이름 / 메일 / 메시지 폼 ]  |
+-------------------------------------------------------------+
|                © 2026 My Name. All rights reserved.         | (Footer)
+-------------------------------------------------------------+
```
