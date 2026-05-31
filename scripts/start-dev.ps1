# IDEActivation 开发环境启动脚本
# 用法: .\scripts\start-dev.ps1

Write-Host @"

╔═══════════════════════════════════════════════════════════════╗
║           IDEActivation - 开发环境启动脚本                      ║
╚═══════════════════════════════════════════════════════════════╝

"@ -ForegroundColor Cyan

# 检查 Node.js
Write-Host "[1/4] 检查 Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "  ✓ Node.js $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Node.js 未安装，请先安装 Node.js" -ForegroundColor Red
    exit 1
}

# 检查 npm
Write-Host "[2/4] 检查 npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "  ✓ npm $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "  ✗ npm 未安装" -ForegroundColor Red
    exit 1
}

# 进入后端目录
Set-Location -Path "backend"

# 安装依赖
Write-Host "[3/4] 安装依赖..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ✗ 依赖安装失败" -ForegroundColor Red
    exit 1
}
Write-Host "  ✓ 依赖安装完成" -ForegroundColor Green

# 创建数据目录
Set-Location -Path ".."
New-Item -ItemType Directory -Path "data" -Force | Out-Null
New-Item -ItemType Directory -Path "logs" -Force | Out-Null

# 复制环境变量
Set-Location -Path "backend"
if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "  ✓ 已创建 .env 文件" -ForegroundColor Green
}

# 启动服务
Write-Host "[4/4] 启动开发服务器..." -ForegroundColor Yellow
Write-Host ""
Write-Host "访问地址: http://localhost:3000" -ForegroundColor Cyan
Write-Host "按 Ctrl+C 停止服务" -ForegroundColor Gray
Write-Host ""

npm run dev
