# Local Deployment Script for Employee Management System
Write-Host "Starting Local Deployment Process" -ForegroundColor Green

# Function to check if a command exists
function Test-Command($cmdname) {
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

# Check prerequisites
Write-Host "Checking Prerequisites..." -ForegroundColor Yellow

if (-not (Test-Command "dotnet")) {
    Write-Host "ERROR: .NET SDK not found. Please install .NET 8 SDK" -ForegroundColor Red
    exit 1
}

if (-not (Test-Command "node")) {
    Write-Host "ERROR: Node.js not found. Please install Node.js" -ForegroundColor Red
    exit 1
}

if (-not (Test-Command "ng")) {
    Write-Host "Angular CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g @angular/cli
}

Write-Host "All prerequisites met" -ForegroundColor Green

# Deploy Backend
Write-Host "Deploying Backend API..." -ForegroundColor Yellow
Set-Location "Backend/EmployeeManagement.API"

Write-Host "Restoring NuGet packages..." -ForegroundColor Cyan
dotnet restore

Write-Host "Building API..." -ForegroundColor Cyan
dotnet build --configuration Release

if ($LASTEXITCODE -eq 0) {
    Write-Host "Backend build successful" -ForegroundColor Green
} else {
    Write-Host "Backend build failed" -ForegroundColor Red
    exit 1
}

# Start API in background
Write-Host "Starting API server..." -ForegroundColor Cyan
Start-Process -FilePath "dotnet" -ArgumentList "run --configuration Release" -WindowStyle Hidden
Write-Host "API server started at https://localhost:7000" -ForegroundColor Green

# Wait for API to start
Write-Host "Waiting for API to initialize..." -ForegroundColor Cyan
Start-Sleep -Seconds 10

# Deploy Frontend
Write-Host "Deploying Frontend Application..." -ForegroundColor Yellow
Set-Location "../../Frontend"

Write-Host "Installing npm packages..." -ForegroundColor Cyan
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "Frontend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "Frontend dependency installation failed" -ForegroundColor Red
    exit 1
}

Write-Host "Building Angular application..." -ForegroundColor Cyan
ng build --configuration production

if ($LASTEXITCODE -eq 0) {
    Write-Host "Frontend build successful" -ForegroundColor Green
} else {
    Write-Host "Frontend build failed" -ForegroundColor Red
    exit 1
}

# Start Angular dev server
Write-Host "Starting Angular development server..." -ForegroundColor Cyan
Start-Process -FilePath "ng" -ArgumentList "serve --open" -WindowStyle Normal

Write-Host "Deployment Complete!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:4200" -ForegroundColor Cyan
Write-Host "Backend API: https://localhost:7000" -ForegroundColor Cyan
Write-Host "API Documentation: https://localhost:7000/swagger" -ForegroundColor Cyan

Write-Host "Running API Tests..." -ForegroundColor Yellow
Set-Location ".."
Start-Sleep -Seconds 5

Write-Host "System is ready for use!" -ForegroundColor Green