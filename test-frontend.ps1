# Frontend Testing Script
Write-Host "🧪 Starting Frontend Tests" -ForegroundColor Green

Set-Location "Frontend"

# Check if Angular CLI is available
if (-not (Get-Command "ng" -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Angular CLI not found. Installing..." -ForegroundColor Red
    npm install -g @angular/cli
}

Write-Host "`n📦 Installing dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

Write-Host "`n🔨 Building application..." -ForegroundColor Yellow
ng build --configuration development

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful" -ForegroundColor Green
} else {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}

Write-Host "`n🔍 Running linting..." -ForegroundColor Yellow
ng lint --fix 2>$null

Write-Host "`n📱 Testing production build..." -ForegroundColor Yellow
ng build --configuration production

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Production build successful" -ForegroundColor Green
} else {
    Write-Host "❌ Production build failed" -ForegroundColor Red
    exit 1
}

Write-Host "`n🎉 All frontend tests passed!" -ForegroundColor Green
Set-Location ".."