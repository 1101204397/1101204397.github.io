/**
 * 1101204397.github.io — Main Script
 * 分类数据、滚动动画、移动端菜单
 */

/* ============================================
   分类卡片数据
   ============================================ */
const CATEGORIES = [
  {
    id: 'docs',
    title: '文档',
    desc: '技术文档、API 参考、架构笔记等系统性知识整理',
    count: '12 篇',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>`
  },
  {
    id: 'tutorials',
    title: '教程',
    desc: '从入门到实践，AI 模型、数据库优化等手把手教程',
    count: '8 篇',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>`
  },
  {
    id: 'tools',
    title: '工具',
    desc: '自研小工具、实用脚本、效率提升利器分享',
    count: '6 个',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
    </svg>`
  },
  {
    id: 'reviews',
    title: '测评',
    desc: 'AI 模型效果对比、数据库性能测试、工具横评',
    count: '5 篇',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>`
  },
  {
    id: 'projects',
    title: '项目',
    desc: '开源项目、Side Project、实验性探索记录',
    count: '4 个',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="16 18 22 12 16 6"/>
      <polyline points="8 6 2 12 8 18"/>
    </svg>`
  },
  {
    id: 'blog',
    title: '随笔',
    desc: '技术思考、阅读笔记、工作总结与感悟',
    count: '10 篇',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>`
  }
];

/* ============================================
   渲染卡片
   ============================================ */
function renderCards() {
  const grid = document.getElementById('cardGrid');
  if (!grid) return;

  grid.innerHTML = CATEGORIES.map((cat, i) => `
    <article class="card" data-index="${i}" data-category="${cat.id}">
      <div class="card-icon">${cat.icon}</div>
      <h3 class="card-title">${cat.title}</h3>
      <p class="card-desc">${cat.desc}</p>
      <span class="card-count">${cat.count}</span>
    </article>
  `).join('');

  // 入场动画 —— 交错出现
  const cards = grid.querySelectorAll('.card');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  cards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.08}s`;
    observer.observe(card);
  });

  // 点击跳转（后续可改为路由）
  cards.forEach((card) => {
    card.addEventListener('click', () => {
      const id = card.dataset.category;
      // 未来：window.location = `/category/${id}.html`
      console.log(`[Navigate] → /category/${id}`);
      // 临时反馈
      card.style.transform = 'scale(0.97)';
      setTimeout(() => { card.style.transform = ''; }, 200);
    });
  });
}

/* ============================================
   移动端菜单
   ============================================ */
function setupMobileMenu() {
  const toggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (!toggle || !navLinks) return;

  toggle.addEventListener('click', () => {
    navLinks.style.display =
      navLinks.style.display === 'flex' ? 'none' : 'flex';
  });

  // 点击链接后收起
  navLinks.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        navLinks.style.display = 'none';
      }
    });
  });

  // 窗口 resize 恢复
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      navLinks.style.display = 'flex';
    } else {
      navLinks.style.display = 'none';
    }
  });
}

/* ============================================
   导航栏滚动效果
   ============================================ */
function setupNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll > 80) {
      navbar.style.borderBottomColor = 'var(--color-border)';
    } else {
      navbar.style.borderBottomColor = 'transparent';
    }

    lastScroll = currentScroll;
  }, { passive: true });
}

/* ============================================
   初始化
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  renderCards();
  setupMobileMenu();
  setupNavbarScroll();
});
