/**
 * Main Application JavaScript
 * UI 인터랙션, 테마 전환, 프로젝트 렌더링, 모달, 폼 검증
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initTypingEffect();
  initMobileMenu();
  initScrollSpyAndReveal();
  initProjects();
  initModal();
  initContactForm();
});

/* ==========================================================================
   1. Theme Toggle (Dark / Light Mode)
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (!themeToggleBtn) return;

  const currentTheme = localStorage.getItem('theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(themeToggleBtn, currentTheme);

  themeToggleBtn.addEventListener('click', () => {
    const activeTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = activeTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(themeToggleBtn, newTheme);
    showToast(`${newTheme === 'dark' ? '다크 모드' : '라이트 모드'}가 적용되었습니다.`);
  });
}

function updateThemeIcon(btn, theme) {
  const icon = btn.querySelector('i');
  if (icon) {
    icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  }
}

/* ==========================================================================
   2. Typing Animation Effect (Hero Section)
   ========================================================================== */
function initTypingEffect() {
  const typingElement = document.getElementById('typing-text');
  if (!typingElement) return;

  const words = [
    'Frontend & Web Technologies.',
    'Clean Architecture & Clean Code.',
    'Web Performance & UI/UX.',
    'Continuous Learning & Tech Insights.'
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingSpeed = 100;
  const deletingSpeed = 50;
  const delayBetweenWords = 1800;

  function type() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      typingElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      setTimeout(type, delayBetweenWords);
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      setTimeout(type, 400);
    } else {
      setTimeout(type, isDeleting ? deletingSpeed : typingSpeed);
    }
  }

  type();
}

/* ==========================================================================
   3. Mobile Navigation Menu Toggle
   ========================================================================== */
function initMobileMenu() {
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!mobileBtn || !navMenu) return;

  mobileBtn.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    const icon = mobileBtn.querySelector('i');
    if (icon) {
      icon.className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
    }
  });

  // Link click auto-closes mobile menu
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        const icon = mobileBtn.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars';
      }
    });
  });
}

/* ==========================================================================
   4. Scroll Spy & Reveal Animations
   ========================================================================== */
function initScrollSpyAndReveal() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const reveals = document.querySelectorAll('.reveal');

  // Scroll Reveal Intersection Observer
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Trigger once
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(el => revealObserver.observe(el));

  // ScrollSpy Active Nav Highlight
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 100;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

/* ==========================================================================
   5. Projects Dynamic Rendering & Filtering
   ========================================================================== */
function initProjects() {
  const container = document.getElementById('projects-container');
  const filterBtns = document.querySelectorAll('#project-filters .filter-btn');

  if (!container || typeof projectsData === 'undefined') return;

  function renderProjects(filter = 'all') {
    const filtered = filter === 'all' 
      ? projectsData 
      : projectsData.filter(p => p.category === filter);

    container.innerHTML = filtered.map(project => `
      <div class="project-card reveal visible" data-id="${project.id}">
        <div class="project-thumb">
          <i class="${project.icon} thumb-icon"></i>
          <span class="project-badge">${project.category.toUpperCase()}</span>
        </div>
        <div class="project-body">
          <h3 class="project-title">${project.title}</h3>
          <p class="project-desc">${project.description}</p>
          <div class="project-tags">
            ${project.tags.map(t => `<span class="project-tag">${t}</span>`).join('')}
          </div>
          <div class="project-links">
            <button class="btn btn-primary btn-detail" onclick="openProjectModal(${project.id})">
              <i class="fa-solid fa-circle-info"></i> 상세보기
            </button>
            <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline">
              <i class="fa-brands fa-github"></i> 코드
            </a>
          </div>
        </div>
      </div>
    `).join('');
  }

  renderProjects('all');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filterValue = btn.getAttribute('data-filter');
      renderProjects(filterValue);
    });
  });
}

/* ==========================================================================
   6. Project Details Modal Popup
   ========================================================================== */
function initModal() {
  const modal = document.getElementById('project-modal');
  const overlay = document.getElementById('modal-overlay');
  const closeBtn = document.getElementById('modal-close');

  if (!modal || !overlay || !closeBtn) return;

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  overlay.addEventListener('click', closeModal);
  closeBtn.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // Global helper for opening modal
  window.openProjectModal = function(id) {
    const project = projectsData.find(p => p.id === id);
    if (!project) return;

    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
      <div style="text-align: center; margin-bottom: 20px;">
        <div style="display: inline-flex; width: 64px; height: 64px; border-radius: 50%; background: var(--primary-light); color: var(--primary); align-items: center; justify-content: center; font-size: 2rem; margin-bottom: 12px;">
          <i class="${project.icon}"></i>
        </div>
        <h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 8px;">${project.title}</h2>
        <span class="project-badge" style="position: static; display: inline-block; background: var(--primary); color: #fff;">${project.category.toUpperCase()}</span>
      </div>

      <p style="color: var(--text-muted); margin-bottom: 20px; font-size: 1rem; line-height: 1.6;">
        ${project.description}
      </p>

      <h4 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 12px; border-bottom: 1px solid var(--border-color); padding-bottom: 6px;">
        주요 구현 기능
      </h4>
      <ul style="list-style: disc; padding-left: 20px; color: var(--text-muted); margin-bottom: 24px;">
        ${project.features.map(f => `<li style="margin-bottom: 6px;">${f}</li>`).join('')}
      </ul>

      <h4 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 12px; border-bottom: 1px solid var(--border-color); padding-bottom: 6px;">
        사용 기술 스택
      </h4>
      <div class="project-tags" style="margin-bottom: 28px;">
        ${project.tags.map(t => `<span class="project-tag">${t}</span>`).join('')}
      </div>

      <div style="display: flex; gap: 12px;">
        <a href="${project.demoUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="flex: 1;">
          <i class="fa-solid fa-arrow-up-right-from-square"></i> 라이브 데모
        </a>
        <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline" style="flex: 1;">
          <i class="fa-brands fa-github"></i> GitHub 저장소
        </a>
      </div>
    `;

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };
}

/* ==========================================================================
   7. Contact Form Validation & Toast Notification
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const subjectInput = document.getElementById('subject');
  const messageInput = document.getElementById('message');

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  function setError(input, errorElementId, message) {
    input.classList.add('error');
    const errEl = document.getElementById(errorElementId);
    if (errEl) errEl.textContent = message;
  }

  function clearError(input, errorElementId) {
    input.classList.remove('error');
    const errEl = document.getElementById(errorElementId);
    if (errEl) errEl.textContent = '';
  }

  // Clear errors on input
  [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
    input.addEventListener('input', () => {
      clearError(input, `${input.id}-error`);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Validate Name
    if (!nameInput.value.trim()) {
      setError(nameInput, 'name-error', '성명 또는 회사명을 입력해 주세요.');
      isValid = false;
    } else {
      clearError(nameInput, 'name-error');
    }

    // Validate Email
    if (!emailInput.value.trim()) {
      setError(emailInput, 'email-error', '이메일 주소를 입력해 주세요.');
      isValid = false;
    } else if (!validateEmail(emailInput.value.trim())) {
      setError(emailInput, 'email-error', '올바른 이메일 형식이 아닙니다.');
      isValid = false;
    } else {
      clearError(emailInput, 'email-error');
    }

    // Validate Subject
    if (!subjectInput.value.trim()) {
      setError(subjectInput, 'subject-error', '제목을 입력해 주세요.');
      isValid = false;
    } else {
      clearError(subjectInput, 'subject-error');
    }

    // Validate Message
    if (!messageInput.value.trim()) {
      setError(messageInput, 'message-error', '문의 내용을 입력해 주세요.');
      isValid = false;
    } else if (messageInput.value.trim().length < 10) {
      setError(messageInput, 'message-error', '메시지는 10자 이상 작성해 주세요.');
      isValid = false;
    } else {
      clearError(messageInput, 'message-error');
    }

    if (isValid) {
      const submitBtn = form.querySelector('.btn-submit');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 전송 중...';

      // Mock Sending delay
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        form.reset();
        showToast('🎉 메시지가 성공적으로 전송되었습니다!');
      }, 1200);
    }
  });
}

/* ==========================================================================
   Toast Notification Helper
   ========================================================================== */
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}
