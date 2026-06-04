# 1101204397.github.io

个人开发者站点 · AI 与数据库方向。记录工作、分享技术、沉淀经验。

---

## 项目结构

```
/
├── index.html          # 首页（静态 HTML）
├── css/style.css       # 全局样式 · 黑白主题
├── js/main.js          # 前端交互 · 卡片渲染
├── assets/             # 静态资源（头像、图片等）
├── backend/            # Node.js 后端 API
│   ├── package.json
│   ├── server.js       # Express + MySQL2
│   └── init.sql        # 数据库初始化
└── README.md
```

## 快速开始

### 前端

直接打开 `index.html` 即可浏览首页，或者用任意静态服务器：

```bash
# Python
python -m http.server 8000

# Node
npx serve .
```

### 后端（需要 MySQL）

```bash
# 1. 初始化数据库
cd backend
mysql -u root -p < init.sql

# 2. 安装依赖
npm install

# 3. 启动 API 服务（默认 3001 端口）
node server.js
```

### 环境变量（可选）

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `PORT` | `3001` | API 服务端口 |
| `DB_HOST` | `localhost` | MySQL 地址 |
| `DB_PORT` | `3306` | MySQL 端口 |
| `DB_USER` | `root` | 数据库用户 |
| `DB_PASS` | `''` | 数据库密码 |
| `DB_NAME` | `site_blog` | 数据库名 |

## API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/categories` | 获取所有分类 |
| GET | `/api/posts?category=docs&page=1` | 文章列表 |
| GET | `/api/posts/:slug` | 文章详情 |
| POST | `/api/visit` | 记录页面访问 |
| GET | `/api/stats` | 站点统计概览 |
| GET | `/api/health` | 健康检查 |

## 配色方案

- **背景**: `#ffffff` 纯白
- **文字**: `#1a1a1a` 近黑 / `#666666` 柔和灰
- **强调**: `#000000` 纯黑
- **卡片**: `#f7f7f7` 极浅灰 → hover `#efefef`

---

MIT License
