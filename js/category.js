/**
 * category.js — 分类页面共享逻辑
 *
 * 每个分类页引入此脚本，自动根据文件名加载对应分类的内容。
 * 本地环境优先从 API 获取数据；线上环境直接展示静态 HTML。
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
function isLocal() {
  const host = window.location.hostname;
  return host === 'localhost' || host === '127.0.0.1';
}

function getCurrentSlug() {
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
   API 请求（仅本地环境调用）
   ============================================ */
const API_BASE = 'http://localhost:3001/api';

async function fetchPosts(categorySlug) {
  // 线上环境 → 跳过 API 请求（避免 CORS 错误）
  if (!isLocal()) {
    window.__API_AVAILABLE = false;
    return [];
  }

  try {
    const url = `${API_BASE}/posts?category=${categorySlug}&limit=50&status=published`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    window.__API_AVAILABLE = true;
    return data.data || [];
  } catch (_) {
    window.__API_AVAILABLE = false;
    return [];
  }
}

/* ============================================
   渲染
   ============================================ */
function renderHeader(slug) {
  const meta = CATEGORY_META[slug];
  if (!meta) return;

  document.title = meta.title + ' · 1101204397';

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

  // 线上环境（无 API）→ 保留静态 HTML，不覆盖
  if (posts.length === 0 && !window.__API_AVAILABLE) {
    if (empty) empty.style.display = 'none';
    if (count) count.textContent = '';
    return;
  }

  if (posts.length === 0) {
    list.innerHTML = '';
    if (empty) empty.style.display = 'block';
    if (count) count.textContent = '0 篇文章';
    return;
  }

  if (empty) empty.style.display = 'none';
  if (count) count.textContent = posts.length + ' 篇文章';

  list.innerHTML = posts.map(function(post) {
    var tagsHtml = '';
    if (post.tags) {
      tagsHtml = post.tags.split(',').map(function(t) {
        return '<span class="tag">' + t.trim() + '</span>';
      }).join('');
    }
    return '<a href="../post/index.html?slug=' + encodeURIComponent(post.slug) + '" class="post-item" style="display:block;">' +
      '<div class="post-meta">' +
        '<span class="post-date">' + formatDate(post.created_at) + '</span>' +
        (tagsHtml ? '<span class="post-tags">' + tagsHtml + '</span>' : '') +
      '</div>' +
      '<h3 class="post-title">' + post.title + '</h3>' +
      (post.summary ? '<p class="post-summary">' + post.summary + '</p>' : '') +
      '<div class="post-footer">' +
        '<span class="post-views">' + (post.view_count || 0) + ' 次阅读</span>' +
      '</div>' +
    '</a>';
  }).join('');
}

/* ============================================
   导航栏滚动
   ============================================ */
function setupNavbarScroll() {
  var navbar = document.querySelector('.navbar');
  if (!navbar) return;
  window.addEventListener('scroll', function() {
    navbar.classList.toggle('scrolled', window.scrollY > 80);
  }, { passive: true });
}

/* ============================================
   移动端菜单
   ============================================ */
function setupMobileMenu() {
  var toggle = document.querySelector('.mobile-toggle');
  var navLinks = document.querySelector('.nav-links');
  if (!toggle || !navLinks) return;

  toggle.addEventListener('click', function() {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
  });

  var links = navLinks.querySelectorAll('.nav-link');
  for (var i = 0; i < links.length; i++) {
    links[i].addEventListener('click', function() {
      if (window.innerWidth <= 768) navLinks.style.display = 'none';
    });
  }

  window.addEventListener('resize', function() {
    navLinks.style.display = window.innerWidth > 768 ? 'flex' : 'none';
  });
}

/* ============================================
   初始化
   ============================================ */
document.addEventListener('DOMContentLoaded', async function() {
  var slug = getCurrentSlug();
  if (!slug || !CATEGORY_META[slug]) {
    document.body.innerHTML = '<p style="text-align:center;padding:120px 24px;color:#999;">分类不存在</p>';
    return;
  }

  renderHeader(slug);
  setupNavbarScroll();
  setupMobileMenu();

  var posts = await fetchPosts(slug);
  renderPosts(posts);
});
