# 使用 Node.js 18 Alpine 镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 安装系统依赖
RUN apk add --no-cache \
    curl \
    tini

# 复制 package.json 和 package-lock.json
COPY backend/package*.json ./backend/

# 安装 Node.js 依赖
RUN cd backend && npm ci --only=production

# 复制后端代码
COPY backend/ ./backend/

# 复制前端代码
COPY frontend/ ./frontend/

# 创建数据目录
RUN mkdir -p /app/data /app/logs

# 设置权限
RUN chown -R node:node /app

# 切换到非 root 用户
USER node

# 暴露端口
EXPOSE 3000

# 使用 tini 作为 init 系统
ENTRYPOINT ["/sbin/tini", "--"]

# 启动命令
CMD ["node", "backend/src/index.js"]
