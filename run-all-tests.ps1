# Comprehensive Testing Script
Write-Host "🚀 Employee Management System - Full Test Suite" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green

$startTime = Get-Date

# Test Backend
Write-Host "`n🔧 Testing Backend..." -ForegroundColor Cyan
& ".\test-backend.ps1"
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Backend tests failed" -ForegroundColor Red
    exit 1
}

# Test Frontend
Write-Host "`n🎨 Testing Frontend..." -ForegroundColor Cyan
& ".\test-frontend.ps1"
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend tests failed" -ForegroundColor Red
    exit 1
}

# Start services for integration testing
Write-Host "`n🔄 Starting services for integration tests..." -ForegroundColor Cyan

# Start API
Start-Process -FilePath "dotnet" -ArgumentList "run --project Backend/EmployeeManagement.API" -WindowStyle Hidden
Write-Host "⏳ Waiting for API to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Test API endpoints
Write-Host "`n🌐 Testing API Integration..." -ForegroundColor Cyan
& ".\test-api.ps1"

$endTime = Get-Date
$duration = $endTime - $startTime

Write-Host "`n🎉 All Tests Completed Successfully!" -ForegroundColor Green
Write-Host "⏱️ Total test duration: $($duration.TotalMinutes.ToString('F2')) minutes" -ForegroundColor Cyan
Write-Host "`n✅ System is ready for deployment!" -ForegroundColor Green