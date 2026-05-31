# IDEActivation Platform

> JetBrains IDE 激活平台 - 仅供技术学习和研究使用

⚠️ **声明**：本项目仅用于学习 Web API 设计、Java Agent 技术、许可证管理系统架构。请勿用于非法用途，请支持正版软件。

## 📋 功能特性

- ✅ 激活码生成 - 生成 JetBrains IDE 激活码
- ✅ 文件下载 - 提供 ja-netfilter 组件下载
- ✅ 一键脚本 - 自动生成激活脚本
- ✅ 使用统计 - 记录使用情况
- ✅ 响应式设计 - 支持移动端访问

## 🚀 快速开始

### 方式一：本地开发

```bash
# 1. 进入项目目录
cd platform

# 2. 安装后端依赖
cd backend
npm install
cd ..

# 3. 复制环境变量
cp backend/.env.example backend/.env

# 4. 启动后端服务
cd backend
npm run dev
```

访问 http://localhost:3000

### 方式二：Docker 部署

```bash
# 1. 构建并启动
docker-compose up -d

# 2. 查看日志
docker-compose logs -f

# 3. 停止服务
docker-compose down
```

## 📁 项目结构

```
platform/
├── backend/                # 后端服务 (Node.js + Express)
│   ├── src/
│   │   ├── config/        # 配置文件
│   │   ├── routes/        # API 路由
│   │   ├── services/      # 业务逻辑
│   │   ├── utils/         # 工具函数
│   │   ├── app.js         # Express 应用
│   │   └── index.js       # 入口文件
│   ├── package.json
│   └── .env.example
├── frontend/               # 前端页面 (HTML + CSS + JS)
│   ├── index.html
│   ├── css/
│   └── js/
├── nginx/                  # Nginx 配置
│   └── nginx.conf
├── docker-compose.yml      # Docker 编排
├── Dockerfile              # Docker 镜像
└── README.md
```

## 🔌 API 接口

### 生成激活码

```http
POST /api/v1/license/generate
Content-Type: application/json

{
  "productCode": "II,PCWMP,PSI",
  "licenseName": "my-ide",
  "assigneeName": "user",
  "expiryDate": "2099-12-31"
}
```

### 验证激活码

```http
POST /api/v1/license/validate
Content-Type: application/json

{
  "licenseKey": "ABC123XYZ-eyJsaWNlbnNlSWQi..."
}
```

### 下载文件

```http
GET /api/v1/download/ja-netfilter/ja-netfilter.jar
GET /api/v1/download/config/dns.conf
GET /api/v1/download/plugin/dns.jar
```

### 获取统计

```http
GET /api/v1/stats/usage
```

### 获取脚本

```http
GET /api/v1/scripts/activate?os=windows
GET /api/v1/scripts/activate?os=linux
```

## 🛠️ 技术栈

| 组件 | 技术 | 说明 |
|------|------|------|
| 后端 | Node.js + Express | RESTful API |
| 前端 | HTML5 + CSS3 + Vanilla JS | 响应式设计 |
| 数据库 | SQLite | 轻量级存储 |
| 部署 | Docker + Nginx | 容器化部署 |

## 📦 环境变量

```bash
# 服务配置
PORT=3000
NODE_ENV=development

# 数据库
DB_PATH=./data/database.sqlite

# 日志
LOG_LEVEL=info
LOG_FILE=./logs/app.log

# 站点
SITE_NAME=IDEActivation
SITE_URL=http://localhost:3000
```

## 🔧 开发命令

```bash
# 启动开发服务器
npm run dev

# 启动生产服务器
npm start

# 运行测试
npm test

# 代码检查
npm run lint
```

## 📝 使用说明

### Windows

```powershell
# 打开 PowerShell (管理员)
irm localhost:3000|iex
```

### Linux/Mac

```bash
# 打开终端
curl -Ls localhost:3000 | bash
```

### 手动激活

1. 下载 `ja-netfilter.jar`
2. 编辑 IDE 的 `*.vmoptions` 文件
3. 添加: `-javaagent:/path/to/ja-netfilter.jar`
4. 重启 IDE
5. 使用生成的激活码

## ⚠️ 免责声明

1. 本项目仅供技术学习和研究使用
2. 请勿用于商业用途
3. 请支持正版软件：https://www.jetbrains.com
4. 使用本项目产生的一切后果由使用者自行承担

## 📄 许可证

MIT License - 仅供学习使用

---

**请支持正版软件** ❤️
