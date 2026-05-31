# 部署指南

## 部署方案选择

| 方案 | 前端 | 后端 | 难度 | 推荐度 |
|------|------|------|------|--------|
| **方案 A** | GitHub Pages | Vercel | ⭐ 简单 | ⭐⭐⭐ 推荐 |
| **方案 B** | Vercel | Vercel | ⭐ 简单 | ⭐⭐⭐ 推荐 |
| **方案 C** | GitHub Pages | Railway | ⭐⭐ 中等 | ⭐⭐ |
| **方案 D** | 自建服务器 | 自建服务器 | ⭐⭐⭐ 复杂 | ⭐ |

---

## 方案 A：GitHub Pages + Vercel (推荐)

### 架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                        用户访问                                  │
│                     yourname.github.io                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    GitHub Pages                                  │
│                    前端静态文件                                   │
│                    (HTML/CSS/JS)                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ API 请求
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Vercel (免费)                                  │
│                    后端 API 服务                                  │
│                    (Node.js)                                     │
└─────────────────────────────────────────────────────────────────┘
```

### 步骤 1：部署后端到 Vercel

1. **注册 Vercel 账号**
   - 访问 https://vercel.com
   - 使用 GitHub 账号登录

2. **导入项目**
   - 点击 "New Project"
   - 选择你的 GitHub 仓库
   - 设置根目录为 `platform`

3. **配置环境变量**
   ```
   NODE_ENV=production
   SITE_URL=https://your-project.vercel.app
   ```

4. **部署**
   - 点击 "Deploy"
   - 等待部署完成
   - 获取域名：`https://your-project.vercel.app`

### 步骤 2：部署前端到 GitHub Pages

1. **修改前端 API 地址**
   
   编辑 `frontend/js/app.js`，将 Vercel 域名填入：
   ```javascript
   const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
     ? window.location.origin
     : 'https://your-project.vercel.app'; // ← 替换为你的 Vercel 域名
   ```

2. **启用 GitHub Pages**
   - 进入 GitHub 仓库设置
   - 找到 "Pages" 选项
   - Source 选择 "GitHub Actions"

3. **推送代码**
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

4. **访问网站**
   - 等待 GitHub Actions 完成
   - 访问：`https://yourname.github.io/your-repo`

---

## 方案 B：全栈部署到 Vercel

### 步骤

1. **准备项目结构**
   
   确保项目根目录有 `vercel.json`：
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "backend/src/index.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       { "src": "/api/(.*)", "dest": "backend/src/index.js" },
       { "src": "/activate", "dest": "backend/src/index.js" },
       { "src": "/(.*)", "dest": "/frontend/$1" }
     ]
   }
   ```

2. **导入到 Vercel**
   - 登录 Vercel
   - 导入 GitHub 仓库
   - 根目录设置为 `platform`
   - 点击 Deploy

3. **访问网站**
   - 域名：`https://your-project.vercel.app`

---

## 方案 C：GitHub Pages + Railway

### 步骤 1：部署后端到 Railway

1. **注册 Railway 账号**
   - 访问 https://railway.app
   - 使用 GitHub 登录

2. **创建项目**
   - New Project → Deploy from GitHub Repo
   - 选择仓库，设置根目录为 `platform/backend`

3. **配置环境变量**
   ```
   PORT=3000
   NODE_ENV=production
   SITE_URL=https://your-app.up.railway.app
   ```

4. **获取域名**
   - Settings → Networking → Generate Domain
   - 获取：`https://your-app.up.railway.app`

### 步骤 2：部署前端到 GitHub Pages

同方案 A 的步骤 2

---

## 环境变量配置

### Vercel 环境变量

在 Vercel 项目设置中添加：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `NODE_ENV` | `production` | 运行环境 |
| `SITE_URL` | `https://your-project.vercel.app` | 站点 URL |
| `DB_PATH` | `/tmp/database.sqlite` | 数据库路径 |
| `LOG_LEVEL` | `info` | 日志级别 |

### Railway 环境变量

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `PORT` | `3000` | 端口 |
| `NODE_ENV` | `production` | 运行环境 |
| `SITE_URL` | `https://your-app.up.railway.app` | 站点 URL |

---

## 自定义域名 (可选)

### GitHub Pages 自定义域名

1. 在仓库根目录创建 `CNAME` 文件：
   ```
   yourdomain.com
   ```

2. 配置 DNS：
   ```
   CNAME: yourname.github.io
   ```

3. 启用 HTTPS：
   - 在 GitHub Pages 设置中勾选 "Enforce HTTPS"

### Vercel 自定义域名

1. 在 Vercel 项目设置中添加域名
2. 配置 DNS：
   ```
   CNAME: cname.vercel-dns.com
   ```

---

## 常见问题

### Q: GitHub Pages 和 Vercel 的域名不一致怎么办？

A: 修改前端 `app.js` 中的 API 地址，指向 Vercel 域名。

### Q: Vercel 部署失败怎么办？

A: 检查：
1. `vercel.json` 配置是否正确
2. Node.js 版本是否兼容
3. 依赖是否完整

### Q: 如何本地测试生产环境？

A: 
```bash
# 安装 Vercel CLI
npm i -g vercel

# 本地运行
vercel dev
```

---

## 部署检查清单

- [ ] 后端部署到 Vercel/Railway
- [ ] 获取后端域名
- [ ] 修改前端 API 地址
- [ ] 前端部署到 GitHub Pages
- [ ] 测试 API 连接
- [ ] 测试激活码生成
- [ ] 测试文件下载

---

## 快速部署命令

```bash
# 1. 克隆仓库
git clone https://github.com/yourusername/ideacrack.git
cd ideacrack/platform

# 2. 安装依赖
cd backend && npm install && cd ..

# 3. 本地测试
cd backend && npm run dev

# 4. 推送到 GitHub
git add .
git commit -m "Initial commit"
git push origin main

# 5. 在 Vercel 导入项目
# 6. 在 GitHub 启用 Pages
# 7. 完成！
```
