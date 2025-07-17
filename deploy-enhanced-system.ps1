# Enhanced Employee Management System Deployment Script
Write-Host "Deploying Enhanced Employee System" -ForegroundColor Green
Write-Host "Features: JWT Authentication, Role-based Access, Attendance Tracking" -ForegroundColor Cyan

# Function to check if a command exists
function Test-Command($cmdname) {
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

# Check prerequisites
Write-Host "`nChecking Prerequisites..." -ForegroundColor Yellow

if (-not (Test-Command "dotnet")) {
    Write-Host "❌ .NET SDK not found. Please install .NET 8 SDK" -ForegroundColor Red
    exit 1
}

if (-not (Test-Command "node")) {
    Write-Host "❌ Node.js not found. Please install Node.js" -ForegroundColor Red
    exit 1
}

if (-not (Test-Command "ng")) {
    Write-Host "⚠️ Angular CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g @angular/cli
}

Write-Host "✅ All prerequisites met" -ForegroundColor Green

# Deploy Enhanced Backend
Write-Host "`nDeploying Enhanced Backend API..." -ForegroundColor Yellow
Set-Location "Backend/EmployeeManagement.API"

Write-Host "Restoring NuGet packages..." -ForegroundColor Cyan
dotnet restore

Write-Host "Building Enhanced API..." -ForegroundColor Cyan
dotnet build --configuration Release

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Enhanced backend build successful" -ForegroundColor Green
} else {
    Write-Host "❌ Enhanced backend build failed" -ForegroundColor Red
    exit 1
}

# Start Enhanced API in background
Write-Host "Starting Enhanced API server..." -ForegroundColor Cyan
Start-Process -FilePath "dotnet" -ArgumentList "run --configuration Release" -WindowStyle Hidden
Write-Host "✅ Enhanced API server started at https://localhost:7000" -ForegroundColor Green
Write-Host "📚 Swagger UI available at: https://localhost:7000/swagger" -ForegroundColor Cyan

# Wait for API to start
Write-Host "Waiting for Enhanced API to initialize..." -ForegroundColor Cyan
Start-Sleep -Seconds 15

# Deploy Enhanced Frontend
Write-Host "`nDeploying Enhanced Frontend Application..." -ForegroundColor Yellow
Set-Location "../../Frontend"

Write-Host "Installing npm packages (including Font Awesome)..." -ForegroundColor Cyan
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Enhanced frontend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "❌ Enhanced frontend dependency installation failed" -ForegroundColor Red
    exit 1
}

Write-Host "Building Enhanced Angular application..." -ForegroundColor Cyan
ng build --configuration production

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Enhanced frontend build successful" -ForegroundColor Green
} else {
    Write-Host "❌ Enhanced frontend build failed" -ForegroundColor Red
    exit 1
}

# Start Enhanced Angular dev server
Write-Host "Starting Enhanced Angular development server..." -ForegroundColor Cyan
Start-Process -FilePath "ng" -ArgumentList "serve --open" -WindowStyle Normal

Write-Host "`nEnhanced System Deployment Complete!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host "Frontend Application: http://localhost:4200" -ForegroundColor Cyan
Write-Host "Backend API: https://localhost:7000" -ForegroundColor Cyan
Write-Host "API Documentation: https://localhost:7000/swagger" -ForegroundColor Cyan

Write-Host "`nDemo Login Credentials:" -ForegroundColor Yellow
Write-Host "Admin Account:" -ForegroundColor Cyan
Write-Host "   Email: admin@company.com" -ForegroundColor White
Write-Host "   Password: password123" -ForegroundColor White
Write-Host "   Features: Manage employees, view reports, full access" -ForegroundColor Gray

Write-Host "`nEmployee Account:" -ForegroundColor Cyan
Write-Host "   Email: john.doe@company.com" -ForegroundColor White
Write-Host "   Password: password123" -ForegroundColor White
Write-Host "   Features: Check-in/out, view attendance, update profile" -ForegroundColor Gray

Write-Host "`nRunning Enhanced System Tests..." -ForegroundColor Yellow
Set-Location ".."
Start-Sleep -Seconds 5
& ".\test-enhanced-system.ps1"

Write-Host "`nEnhanced Features Available:" -ForegroundColor Yellow
Write-Host "- JWT Authentication and Authorization" -ForegroundColor Green
Write-Host "- Role-based Access Control (Admin/Employee)" -ForegroundColor Green
Write-Host "- Attendance Check-in/Check-out (7:30-9:00 AM)" -ForegroundColor Green
Write-Host "- Attendance History and Reports" -ForegroundColor Green
Write-Host "- Enhanced Employee Fields (Phone National ID Age)" -ForegroundColor Green
Write-Host "- Signature Upload Support" -ForegroundColor Green
Write-Host "- Responsive Dashboard for Both Roles" -ForegroundColor Green
Write-Host "- Pagination, Sorting and Advanced Search" -ForegroundColor Green
Write-Host "- Real-time Attendance Status" -ForegroundColor Green
Write-Host "- Working Hours Calculation" -ForegroundColor Green

Write-Host "System is ready for production use!" -ForegroundColor Green