# 1101204397.github.io

个人开发者站点 · AI 与数据库方向。记录工作、分享技术、沉淀经验。

---

## 项目结构

```
/
├── index.html            # 首页（静态 HTML，可部署 GitHub Pages）
├── css/style.css         # 全局样式 · 黑白极简主题 · 响应式
├── js/main.js            # 前端交互 · 卡片渲染 · 滚动动画
├── assets/
│   └── avatar.svg        # SVG 渐变头像（可替换为真实照片）
├── backend/              # Node.js 后端 API
│   ├── package.json
│   ├── server.js         # Express + MySQL2 · 完整 RESTful 接口
│   ├── init.sql          # 数据库初始化（建库+建表+初始数据）
│   └── .env              # 环境配置（⚠️ 已 gitignore，不上传）
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

### 分类

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/categories` | 获取所有分类 |

### 文章（CRUD）

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/posts?category=docs&page=1&limit=10` | 文章列表（分页+筛选） |
| GET | `/api/posts/:slug` | 文章详情（自动 +1 阅读计数） |
| POST | `/api/posts` | 创建文章 |
| PUT | `/api/posts/:id` | 更新文章 |
| DELETE | `/api/posts/:id` | 删除文章 |

**POST /api/posts 请求体：**

```json
{
  "category_id": 1,
  "title": "文章标题",
  "content": "# Markdown 正文",
  "summary": "摘要",
  "tags": "标签1,标签2",
  "status": "draft | published | archived"
}
```

### 其他

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/visit` | 记录页面访问 |
| GET | `/api/stats` | 站点统计概览 |
| GET | `/api/health` | 健康检查 |

## 配色方案

- **背景**: `#ffffff` 纯白
- **文字**: `#1a1a1a` 近黑 / `#666666` 柔和灰
- **强调**: `#000000` 纯黑
- **卡片**: `#f7f7f7` 极浅灰 → hover `#efefef`

---

## 部署到 GitHub Pages

1. 推送代码到 GitHub：

```bash
git push origin master
```

2. 在浏览器打开仓库设置：  
   `https://github.com/1101204397/1101204397.github.io/settings/pages`

3. **Source** 选择 `master` 分支 → `/ (root)` 目录 → 点 **Save**

4. 等 1-2 分钟，你的站点将在 `https://1101204397.github.io` 生效

---

MIT License
