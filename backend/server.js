/**
 * 个人站点后端 API
 * Express + MySQL2 — 提供 RESTful 接口
 *
 * 启动: npm install && node server.js
 * 默认端口: 3001
 */

const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config({ path: __dirname + '/.env' });

const app = express();
const PORT = process.env.PORT || 3001;

/* ---- 中间件 ---- */
app.use(cors({ origin: '*' }));
app.use(express.json());

/* ---- MySQL 连接池 ---- */
const pool = mysql.createPool({
  host:     process.env.DB_HOST || 'localhost',
  port:     process.env.DB_PORT || 3306,
  user:     process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'site_blog',
  waitForConnections: true,
  connectionLimit: 10,
  charset: 'utf8mb4',
});

/* ============================================
   API 路由
   ============================================ */

/**
 * GET /api/categories — 获取所有分类
 */
app.get('/api/categories', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, slug, name, description, sort_order FROM categories ORDER BY sort_order'
    );
    res.json({ data: rows });
  } catch (err) {
    console.error('[DB] categories error:', err.message);
    res.status(500).json({ error: '数据库查询失败' });
  }
});

/**
 * GET /api/posts — 获取文章列表
 * query: ?category=docs&page=1&limit=10&status=published
 */
app.get('/api/posts', async (req, res) => {
  try {
    const { category, page = 1, limit = 10, status = 'published' } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let sql = `
      SELECT p.id, p.title, p.slug, p.summary, p.tags, p.view_count,
             p.created_at, c.slug AS category_slug, c.name AS category_name
      FROM posts p
      JOIN categories c ON p.category_id = c.id
      WHERE p.status = ?
    `;
    const params = [status];

    if (category) {
      sql += ' AND c.slug = ?';
      params.push(category);
    }

    sql += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), offset);

    const [rows] = await pool.query(sql, params);

    // 总条数
    const [countResult] = await pool.query(
      `SELECT COUNT(*) AS total FROM posts p
       JOIN categories c ON p.category_id = c.id
       WHERE p.status = ? ${category ? 'AND c.slug = ?' : ''}`,
      category ? [status, category] : [status]
    );

    res.json({
      data: rows,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: countResult[0].total,
      },
    });
  } catch (err) {
    console.error('[DB] posts error:', err.message);
    res.status(500).json({ error: '数据库查询失败' });
  }
});

/**
 * GET /api/posts/:slug — 获取单篇文章详情
 */
app.get('/api/posts/:slug', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.*, c.slug AS category_slug, c.name AS category_name
       FROM posts p
       JOIN categories c ON p.category_id = c.id
       WHERE p.slug = ?`,
      [req.params.slug]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: '文章不存在' });
    }

    // 增加阅读计数
    await pool.query('UPDATE posts SET view_count = view_count + 1 WHERE id = ?', [rows[0].id]);

    res.json({ data: rows[0] });
  } catch (err) {
    console.error('[DB] post detail error:', err.message);
    res.status(500).json({ error: '数据库查询失败' });
  }
});

/**
 * POST /api/visit — 记录访问
 */
app.post('/api/visit', async (req, res) => {
  try {
    const { page } = req.body;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'] || '';

    await pool.query(
      'INSERT INTO visit_logs (page, ip, user_agent) VALUES (?, ?, ?)',
      [page || '/', ip, userAgent]
    );
    res.status(201).json({ ok: true });
  } catch (err) {
    // 访问日志失败不影响主流程
    console.error('[DB] visit log error:', err.message);
    res.status(500).json({ error: '记录失败' });
  }
});

/**
 * GET /api/stats — 站点统计概览
 */
app.get('/api/stats', async (req, res) => {
  try {
    const [postCount] = await pool.query(
      "SELECT COUNT(*) AS total FROM posts WHERE status = 'published'"
    );
    const [categoryCount] = await pool.query(
      'SELECT COUNT(*) AS total FROM categories'
    );
    const [visitCount] = await pool.query(
      'SELECT COUNT(*) AS total FROM visit_logs'
    );

    res.json({
      data: {
        posts:   postCount[0].total,
        categories: categoryCount[0].total,
        visits:  visitCount[0].total,
      },
    });
  } catch (err) {
    console.error('[DB] stats error:', err.message);
    res.status(500).json({ error: '查询失败' });
  }
});

/* ---- 健康检查 ---- */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

/* ---- 启动 ---- */
app.listen(PORT, () => {
  console.log(`
  ┌──────────────────────────────────────────┐
  │  个人站点后端 API                          │
  │  监听端口: ${String(PORT).padEnd(32)}│
  │  健康检查: http://localhost:${PORT}/api/health │
  │  数据库:   site_blog                      │
  └──────────────────────────────────────────┘
  `);
});
