#!/bin/bash
# IDEActivation 开发环境启动脚本
# 用法: ./scripts/start-dev.sh

echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║           IDEActivation - 开发环境启动脚本                      ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 检查 Node.js
echo -e "${YELLOW}[1/4] 检查 Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}  ✗ Node.js 未安装，请先安装 Node.js${NC}"
    exit 1
fi
NODE_VERSION=$(node --version)
echo -e "${GREEN}  ✓ Node.js $NODE_VERSION${NC}"

# 检查 npm
echo -e "${YELLOW}[2/4] 检查 npm...${NC}"
if ! command -v npm &> /dev/null; then
    echo -e "${RED}  ✗ npm 未安装${NC}"
    exit 1
fi
NPM_VERSION=$(npm --version)
echo -e "${GREEN}  ✓ npm $NPM_VERSION${NC}"

# 进入后端目录
cd backend

# 安装依赖
echo -e "${YELLOW}[3/4] 安装依赖...${NC}"
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}  ✗ 依赖安装失败${NC}"
    exit 1
fi
echo -e "${GREEN}  ✓ 依赖安装完成${NC}"

# 创建数据目录
cd ..
mkdir -p data logs

# 复制环境变量
cd backend
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo -e "${GREEN}  ✓ 已创建 .env 文件${NC}"
fi

# 启动服务
echo -e "${YELLOW}[4/4] 启动开发服务器...${NC}"
echo ""
echo -e "访问地址: ${GREEN}http://localhost:3000${NC}"
echo "按 Ctrl+C 停止服务"
echo ""

npm run dev
