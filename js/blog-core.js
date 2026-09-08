/**
 * Blog Core Engine & Storage Manager
 * 로컬스토리지 기반 게시글, 회원 인증, 댓글 및 공통 UI 상태 관리
 */

(function () {
  const STORAGE_KEYS = {
    POSTS: 'devlog_posts',
    USERS: 'devlog_users',
    CURRENT_USER: 'devlog_current_user',
    COMMENTS: 'devlog_comments',
    LIKES: 'devlog_likes'
  };

  // 1. 스토리지 초기화
  function initStorage() {
    if (!localStorage.getItem(STORAGE_KEYS.POSTS)) {
      if (typeof initialBlogData !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(initialBlogData.posts));
      } else {
        localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify([]));
      }
    }

    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      if (typeof initialBlogData !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialBlogData.users));
      } else {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([]));
      }
    }

    if (!localStorage.getItem(STORAGE_KEYS.COMMENTS)) {
      if (typeof initialBlogData !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(initialBlogData.comments));
      } else {
        localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify([]));
      }
    }

    if (!localStorage.getItem(STORAGE_KEYS.LIKES)) {
      localStorage.setItem(STORAGE_KEYS.LIKES, JSON.stringify([]));
    }
  }

  // 초기화 실행
  initStorage();

  // ==================== AUTH SERVICE ====================
  const BlogAuth = {
    getUsers() {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
      } catch (e) {
        return [];
      }
    },

    getCurrentUser() {
      try {
        const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
        return user ? JSON.parse(user) : null;
      } catch (e) {
        return null;
      }
    },

    login(email, password) {
      const users = this.getUsers();
      const user = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password);
      if (user) {
        // 비밀번호 제외하고 저장
        const sessionUser = { ...user };
        delete sessionUser.password;
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(sessionUser));
        return { success: true, user: sessionUser };
      }
      return { success: false, message: '이메일 또는 비밀번호가 일치하지 않습니다.' };
    },

    signup(userData) {
      const users = this.getUsers();
      const exists = users.some(u => u.email.toLowerCase() === userData.email.trim().toLowerCase());
      if (exists) {
        return { success: false, message: '이미 가입된 이메일 주소입니다.' };
      }

      const newUser = {
        id: 'user_' + Date.now(),
        email: userData.email.trim(),
        password: userData.password,
        name: userData.name ? userData.name.trim() : '블로그 이용자',
        nickname: userData.nickname ? userData.nickname.trim() : '이용자',
        bio: userData.bio || '안녕하세요! 반갑습니다.',
        avatar: userData.avatar || 'assets/images/profile.jpg',
        role: 'user',
        joinedAt: new Date().toISOString().split('T')[0],
        github: userData.github || 'https://github.com',
        blog: userData.blog || '',
        interests: userData.interests || ['Web Development']
      };

      users.push(newUser);
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

      // 자동 로그인 처리
      const sessionUser = { ...newUser };
      delete sessionUser.password;
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(sessionUser));

      return { success: true, user: sessionUser };
    },

    logout() {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      window.location.reload();
    },

    updateProfile(updatedData) {
      const currentUser = this.getCurrentUser();
      if (!currentUser) return { success: false, message: '로그인이 필요합니다.' };

      const users = this.getUsers();
      const userIndex = users.findIndex(u => u.id === currentUser.id);

      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updatedData };
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

        const updatedSession = { ...users[userIndex] };
        delete updatedSession.password;
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updatedSession));
        return { success: true, user: updatedSession };
      }
      return { success: false, message: '사용자를 찾을 수 없습니다.' };
    }
  };

  // ==================== POST SERVICE ====================
  const BlogPost = {
    getAll() {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.POSTS)) || [];
      } catch (e) {
        return [];
      }
    },

    getById(id) {
      const posts = this.getAll();
      return posts.find(p => p.id === Number(id) || p.id === id);
    },

    create(postData) {
      const posts = this.getAll();
      const user = BlogAuth.getCurrentUser() || {
        id: 'user_anonymous',
        nickname: '익명 블로거',
        name: '익명',
        avatar: 'assets/images/profile.jpg'
      };

      const now = new Date();
      const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      // 읽는 시간 추정 (한국어 400자 기준 1분)
      const wordCount = (postData.content || '').length;
      const estimatedMinutes = Math.max(1, Math.ceil(wordCount / 400));

      const newPost = {
        id: Date.now(),
        title: postData.title,
        category: postData.category || 'devlife',
        categoryName: postData.categoryName || '개발 이야기',
        summary: postData.summary || postData.content.substring(0, 120) + '...',
        coverImage: postData.coverImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop',
        authorId: user.id,
        authorName: user.name || user.nickname,
        authorAvatar: user.avatar || 'assets/images/profile.jpg',
        createdAt: dateStr,
        readTime: `${estimatedMinutes}분`,
        views: 0,
        likes: 0,
        tags: postData.tags || [],
        featured: postData.featured || false,
        content: postData.content
      };

      posts.unshift(newPost);
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
      return newPost;
    },

    update(id, postData) {
      const posts = this.getAll();
      const index = posts.findIndex(p => p.id === Number(id) || p.id === id);
      if (index === -1) return null;

      const wordCount = (postData.content || '').length;
      const estimatedMinutes = Math.max(1, Math.ceil(wordCount / 400));

      posts[index] = {
        ...posts[index],
        title: postData.title,
        category: postData.category,
        categoryName: postData.categoryName || posts[index].categoryName,
        summary: postData.summary || postData.content.substring(0, 120) + '...',
        coverImage: postData.coverImage || posts[index].coverImage,
        tags: postData.tags || posts[index].tags,
        readTime: `${estimatedMinutes}분`,
        content: postData.content,
        updatedAt: new Date().toISOString().split('T')[0]
      };

      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
      return posts[index];
    },

    delete(id) {
      let posts = this.getAll();
      posts = posts.filter(p => p.id !== Number(id) && p.id !== id);
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));

      // 관련 댓글 삭제
      let comments = BlogComment.getAll();
      comments = comments.filter(c => c.postId !== Number(id) && c.postId !== id);
      localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));
      return true;
    },

    incrementViews(id) {
      const posts = this.getAll();
      const post = posts.find(p => p.id === Number(id) || p.id === id);
      if (post) {
        post.views = (post.views || 0) + 1;
        localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
        return post.views;
      }
      return 0;
    },

    toggleLike(id) {
      const user = BlogAuth.getCurrentUser();
      const currentUserId = user ? user.id : 'guest';
      const likeKey = `${currentUserId}_${id}`;

      let likesList = [];
      try {
        likesList = JSON.parse(localStorage.getItem(STORAGE_KEYS.LIKES)) || [];
      } catch (e) {}

      const isLiked = likesList.includes(likeKey);
      const posts = this.getAll();
      const post = posts.find(p => p.id === Number(id) || p.id === id);

      if (!post) return { liked: false, count: 0 };

      if (isLiked) {
        likesList = likesList.filter(k => k !== likeKey);
        post.likes = Math.max(0, (post.likes || 0) - 1);
      } else {
        likesList.push(likeKey);
        post.likes = (post.likes || 0) + 1;
      }

      localStorage.setItem(STORAGE_KEYS.LIKES, JSON.stringify(likesList));
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));

      return { liked: !isLiked, count: post.likes };
    },

    isPostLiked(id) {
      const user = BlogAuth.getCurrentUser();
      const currentUserId = user ? user.id : 'guest';
      const likeKey = `${currentUserId}_${id}`;
      try {
        const likesList = JSON.parse(localStorage.getItem(STORAGE_KEYS.LIKES)) || [];
        return likesList.includes(likeKey);
      } catch (e) {
        return false;
      }
    },

    getLikedPosts() {
      const user = BlogAuth.getCurrentUser();
      if (!user) return [];
      const prefix = `${user.id}_`;
      try {
        const likesList = JSON.parse(localStorage.getItem(STORAGE_KEYS.LIKES)) || [];
        const likedPostIds = likesList
          .filter(k => k.startsWith(prefix))
          .map(k => Number(k.replace(prefix, '')) || k.replace(prefix, ''));
        const posts = this.getAll();
        return posts.filter(p => likedPostIds.includes(p.id));
      } catch (e) {
        return [];
      }
    }
  };

  // ==================== COMMENT SERVICE ====================
  const BlogComment = {
    getAll() {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.COMMENTS)) || [];
      } catch (e) {
        return [];
      }
    },

    getByPostId(postId) {
      const comments = this.getAll();
      return comments.filter(c => c.postId === Number(postId) || c.postId === postId);
    },

    add(postId, content, guestAuthor = null) {
      const user = BlogAuth.getCurrentUser();
      const comments = this.getAll();

      const now = new Date();
      const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      const newComment = {
        id: Date.now(),
        postId: Number(postId) || postId,
        userId: user ? user.id : 'guest_' + Date.now(),
        userName: user ? (user.nickname || user.name) : (guestAuthor || '방문자'),
        userAvatar: user ? (user.avatar || 'assets/images/profile.jpg') : 'assets/images/강아지.jpg',
        createdAt: dateStr,
        content: content.trim()
      };

      comments.push(newComment);
      localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));
      return newComment;
    },

    delete(commentId) {
      let comments = this.getAll();
      comments = comments.filter(c => c.id !== Number(commentId) && c.id !== commentId);
      localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));
      return true;
    }
  };

  // ==================== UI HELPERS ====================
  function showToast(message, type = 'info') {
    let toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.className = 'toast';
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.className = `toast show ${type}`;

    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  // 상단 네비게이션 로그인 상태 자동 렌더링
  function initBlogNavbar() {
    const authContainer = document.getElementById('nav-auth-container');
    if (!authContainer) return;

    const currentUser = BlogAuth.getCurrentUser();

    if (currentUser) {
      authContainer.innerHTML = `
        <a href="write.html" class="btn btn-sm btn-primary nav-write-btn" title="새 글 작성">
          <i class="fa-solid fa-pen-nib"></i> <span class="nav-btn-text">글쓰기</span>
        </a>
        <div class="user-profile-menu">
          <a href="profile.html" class="user-avatar-link" title="내 프로필 (${currentUser.nickname || currentUser.name})">
            <img src="${currentUser.avatar || 'assets/images/profile.jpg'}" alt="프로필" class="nav-avatar-img">
            <span class="nav-user-name">${currentUser.nickname || currentUser.name}</span>
          </a>
          <button id="logout-btn" class="btn btn-sm btn-outline nav-logout-btn" title="로그아웃">
            <i class="fa-solid fa-arrow-right-from-bracket"></i>
          </button>
        </div>
      `;

      const logoutBtn = document.getElementById('logout-btn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
          e.preventDefault();
          if (confirm('로그아웃 하시겠습니까?')) {
            BlogAuth.logout();
          }
        });
      }
    } else {
      authContainer.innerHTML = `
        <a href="login.html" class="btn btn-sm btn-outline nav-login-btn">
          <i class="fa-solid fa-arrow-right-to-bracket"></i> <span class="nav-btn-text">로그인</span>
        </a>
        <a href="signup.html" class="btn btn-sm btn-primary nav-signup-btn">
          <i class="fa-solid fa-user-plus"></i> <span class="nav-btn-text">회원가입</span>
        </a>
      `;
    }
  }

  // 간단한 마크다운 파서 (제목, 코드블록, 인용, 굵게, 기울임, 링크)
  function parseSimpleMarkdown(markdown) {
    if (!markdown) return '';
    let html = markdown
      // 코드 블록
      .replace(/```([a-zA-Z]*)\n([\s\S]*?)```/g, (match, lang, code) => {
        const escaped = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return `<div class="code-block-wrapper"><div class="code-header"><span class="code-lang">${lang || 'code'}</span><button class="copy-code-btn" onclick="navigator.clipboard.writeText(\`${escaped.replace(/`/g, '\\`')}\`);BlogCore.showToast('코드가 복사되었습니다!')"><i class="fa-regular fa-copy"></i> 복사</button></div><pre><code class="language-${lang}">${escaped}</code></pre></div>`;
      })
      // 인라인 코드
      .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
      // 헤딩
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      // 인용
      .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
      // 굵게 & 기울임
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // 구분선
      .replace(/^---$/gim, '<hr class="post-divider" />')
      // 링크
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      // 리스트
      .replace(/^\- (.*$)/gim, '<li>$1</li>')
      // 줄바꿈
      .replace(/\n\n/g, '<p></p>')
      .replace(/\n/g, '<br>');

    // ul 묶기
    html = html.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
    return html;
  }

  // 전역 API 노출
  window.BlogCore = {
    Auth: BlogAuth,
    Post: BlogPost,
    Comment: BlogComment,
    showToast: showToast,
    initBlogNavbar: initBlogNavbar,
    parseSimpleMarkdown: parseSimpleMarkdown
  };

  // DOM 로드 시 자동 실행
  document.addEventListener('DOMContentLoaded', () => {
    initBlogNavbar();
  });
})();
