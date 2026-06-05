/**
 * export.js — 将数据库中的已发布文章导出为静态 JSON
 * 用法: node backend/export.js
 *
 * 导出的 data/posts.json 会随代码部署到 GitHub Pages，
 * 作为 API 不可用时的兜底数据源。
 */

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: __dirname + '/.env' });

async function run() {
  const pool = mysql.createPool({
    host:     process.env.DB_HOST || 'localhost',
    port:     process.env.DB_PORT || 3306,
    user:     process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'site_blog',
    charset: 'utf8mb4',
  });

  // 查询所有已发布文章，按分类分组
  const [posts] = await pool.query(`
    SELECT p.id, p.title, p.slug, p.summary, p.content, p.tags, p.status,
           p.view_count, p.created_at, p.updated_at,
           c.slug AS category_slug, c.name AS category_name
    FROM posts p
    JOIN categories c ON p.category_id = c.id
    WHERE p.status = 'published'
    ORDER BY p.created_at DESC
  `);

  const [categories] = await pool.query(
    'SELECT id, slug, name, description FROM categories ORDER BY sort_order'
  );

  // 构建导出数据
  const exportData = {
    exported_at: new Date().toISOString(),
    total: posts.length,
    categories: categories.map(c => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      description: c.description,
      count: posts.filter(p => p.category_slug === c.slug).length,
    })),
    posts: posts.map(p => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      summary: p.summary,
      content: p.content,
      tags: p.tags ? p.tags.split(',').map(t => t.trim()) : [],
      view_count: p.view_count,
      created_at: p.created_at,
      category_slug: p.category_slug,
      category_name: p.category_name,
    })),
  };

  // 写入 data/posts.json
  const outputPath = path.join(__dirname, '..', 'data', 'posts.json');
  fs.writeFileSync(outputPath, JSON.stringify(exportData, null, 2), 'utf-8');
  console.log(`✅ 已导出 ${posts.length} 篇文章到 data/posts.json`);

  await pool.end();
}

run().catch(err => {
  console.error('❌ 导出失败:', err.message);
  process.exit(1);
});
