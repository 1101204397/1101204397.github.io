-- ============================================
-- 个人站点数据库初始化脚本
-- 使用: mysql -u root -p < init.sql
-- ============================================

CREATE DATABASE IF NOT EXISTS site_blog
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE site_blog;

-- ============================================
-- 分类表
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  slug        VARCHAR(48)  NOT NULL UNIQUE COMMENT 'URL 标识符，如 docs, tutorials',
  name        VARCHAR(32)  NOT NULL COMMENT '显示名称',
  description VARCHAR(255) DEFAULT NULL COMMENT '简短描述',
  icon_svg    TEXT         DEFAULT NULL COMMENT 'SVG 图标代码',
  sort_order  INT          DEFAULT 0 COMMENT '排序权重',
  created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================
-- 文章表
-- ============================================
CREATE TABLE IF NOT EXISTS posts (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT          NOT NULL,
  title       VARCHAR(200) NOT NULL,
  slug        VARCHAR(191) NOT NULL UNIQUE COMMENT 'URL 标识符（唯一）',
  summary     VARCHAR(500) DEFAULT NULL COMMENT '摘要/简介',
  content     LONGTEXT     DEFAULT NULL COMMENT 'Markdown 正文',
  tags        VARCHAR(255) DEFAULT NULL COMMENT '逗号分隔的标签',
  status      ENUM('draft','published','archived') DEFAULT 'draft',
  view_count  INT          DEFAULT 0,
  created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- 访问日志表
-- ============================================
CREATE TABLE IF NOT EXISTS visit_logs (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  page       VARCHAR(255) NOT NULL COMMENT '访问页面路径',
  ip         VARCHAR(45)  DEFAULT NULL,
  user_agent TEXT         DEFAULT NULL,
  visited_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================
-- 初始化分类数据
-- ============================================
INSERT INTO categories (slug, name, description, sort_order) VALUES
  ('docs',       '文档', '技术文档、API 参考、架构笔记等系统性知识整理', 1),
  ('tutorials',  '教程', '从入门到实践，AI 模型、数据库优化等手把手教程', 2),
  ('tools',      '工具', '自研小工具、实用脚本、效率提升利器分享',       3),
  ('reviews',    '测评', 'AI 模型效果对比、数据库性能测试、工具横评',   4),
  ('projects',   '项目', '开源项目、Side Project、实验性探索记录',       5),
  ('blog',       '随笔', '技术思考、阅读笔记、工作总结与感悟',           6)
ON DUPLICATE KEY UPDATE name = VALUES(name);
