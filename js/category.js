/**
 * category.js — 分类页面共享逻辑
 *
 * 每个分类页引入此脚本，自动根据文件名加载对应分类的内容。
 * 优先从本地 API (localhost:3001) 获取数据，不可用时显示空状态。
 */

/* ============================================
   分类元数据（与首页保持同步）
   ============================================ */
const CATEGORY_META = {
  docs:       { title: '文档',       desc: '技术文档、API 参考、架构笔记等系统性知识整理' },
  tutorials:  { title: '教程',       desc: '从入门到实践，AI 模型、数据库优化等手把手教程' },
  tools:      { title: '工具',       desc: '自研小工具、实用脚本、效率提升利器分享' },
  reviews:    { title: '测评',       desc: 'AI 模型效果对比、数据库性能测试、工具横评' },
  projects:   { title: '项目',       desc: '开源项目、Side Project、实验性探索记录' },
  blog:       { title: '随笔',       desc: '技术思考、阅读笔记、工作总结与感悟' },
};

/* ============================================
   工具函数
   ============================================ */
function getCurrentSlug() {
  // 从 URL 中提取文件名作为分类标识
  const path = window.location.pathname;
  const match = path.match(/\/(\w+)\.html$/);
  return match ? match[1] : null;
}

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/* ============================================
   API 请求
   ============================================ */
const API_BASE = 'http://localhost:3001/api';

async function fetchPosts(categorySlug) {
  try {
    const url = `${API_BASE}/posts?category=${categorySlug}&limit=50&status=published`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.data || [];
  } catch {
    return []; // 线上 → 无 API → 显示空状态
  }
}

/* ============================================
   渲染
   ============================================ */
function renderHeader(slug) {
  const meta = CATEGORY_META[slug];
  if (!meta) return;

  document.title = `${meta.title} · 1101204397`;

  const titleEl = document.getElementById('categoryTitle');
  const descEl = document.getElementById('categoryDesc');
  if (titleEl) titleEl.textContent = meta.title;
  if (descEl) descEl.textContent = meta.desc;
}

function renderPosts(posts) {
  const list = document.getElementById('postList');
  const empty = document.getElementById('emptyState');
  const count = document.getElementById('postCount');

  if (!list) return;

  if (posts.length === 0) {
    list.innerHTML = '';
    if (empty) empty.style.display = 'block';
    if (count) count.textContent = '0 篇文章';
    return;
  }

  if (empty) empty.style.display = 'none';
  if (count) count.textContent = `${posts.length} 篇文章`;

  list.innerHTML = posts.map((post) => `
    <article class="post-item">
      <div class="post-meta">
        <span class="post-date">${formatDate(post.created_at)}</span>
        ${post.tags ? `<span class="post-tags">${post.tags.split(',').map(t => `<span class="tag">${t.trim()}</span>`).join('')}</span>` : ''}
      </div>
      <h3 class="post-title">${post.title}</h3>
      ${post.summary ? `<p class="post-summary">${post.summary}</p>` : ''}
      <div class="post-footer">
        <span class="post-views">${post.view_count || 0} 次阅读</span>
      </div>
    </article>
  `).join('');
}

/* ============================================
   导航栏滚动
   ============================================ */
function setupNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.style.borderBottomColor = window.scrollY > 80 ? 'var(--color-border)' : 'transparent';
  }, { passive: true });
}

/* ============================================
   移动端菜单
   ============================================ */
function setupMobileMenu() {
  const toggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (!toggle || !navLinks) return;

  toggle.addEventListener('click', () => {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
  });
  navLinks.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) navLinks.style.display = 'none';
    });
  });
  window.addEventListener('resize', () => {
    navLinks.style.display = window.innerWidth > 768 ? 'flex' : 'none';
  });
}

/* ============================================
   初始化
   ============================================ */
document.addEventListener('DOMContentLoaded', async () => {
  const slug = getCurrentSlug();
  if (!slug || !CATEGORY_META[slug]) {
    document.body.innerHTML = '<p style="text-align:center;padding:120px 24px;color:#999;">分类不存在</p>';
    return;
  }

  renderHeader(slug);
  setupNavbarScroll();
  setupMobileMenu();

  const posts = await fetchPosts(slug);
  renderPosts(posts);
});
