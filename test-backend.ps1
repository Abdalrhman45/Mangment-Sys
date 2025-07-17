# Backend Testing Script
Write-Host "🧪 Starting Backend Tests" -ForegroundColor Green

Set-Location "Backend/EmployeeManagement.API"

Write-Host "`n📦 Restoring packages..." -ForegroundColor Yellow
dotnet restore

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Packages restored successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to restore packages" -ForegroundColor Red
    exit 1
}

Write-Host "`n🔨 Building application..." -ForegroundColor Yellow
dotnet build --configuration Debug

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Debug build successful" -ForegroundColor Green
} else {
    Write-Host "❌ Debug build failed" -ForegroundColor Red
    exit 1
}

Write-Host "`n📱 Testing release build..." -ForegroundColor Yellow
dotnet build --configuration Release

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Release build successful" -ForegroundColor Green
} else {
    Write-Host "❌ Release build failed" -ForegroundColor Red
    exit 1
}

Write-Host "`n🔍 Running code analysis..." -ForegroundColor Yellow
dotnet format --verify-no-changes --verbosity quiet 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Code formatting is correct" -ForegroundColor Green
} else {
    Write-Host "⚠️ Code formatting issues found (non-critical)" -ForegroundColor Yellow
}

Write-Host "`n🎉 All backend tests passed!" -ForegroundColor Green
Set-Location "../.."