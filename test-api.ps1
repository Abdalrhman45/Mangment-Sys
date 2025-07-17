# Employee Management API Testing Script
Write-Host "🚀 Starting Employee Management API Tests" -ForegroundColor Green

# Test API Base URL
$baseUrl = "https://localhost:7000/api/employees"

Write-Host "`n📋 Testing API Endpoints..." -ForegroundColor Yellow

try {
    # Test 1: Get All Employees
    Write-Host "`n1. Testing GET /api/employees" -ForegroundColor Cyan
    $response = Invoke-RestMethod -Uri $baseUrl -Method GET -SkipCertificateCheck
    Write-Host "✅ GET All Employees: Success - Found $($response.Count) employees" -ForegroundColor Green
    
    # Test 2: Get Employee by ID
    if ($response.Count -gt 0) {
        $firstEmployeeId = $response[0].id
        Write-Host "`n2. Testing GET /api/employees/$firstEmployeeId" -ForegroundColor Cyan
        $employee = Invoke-RestMethod -Uri "$baseUrl/$firstEmployeeId" -Method GET -SkipCertificateCheck
        Write-Host "✅ GET Employee by ID: Success - Retrieved $($employee.firstName) $($employee.lastName)" -ForegroundColor Green
    }
    
    # Test 3: Create New Employee
    Write-Host "`n3. Testing POST /api/employees" -ForegroundColor Cyan
    $newEmployee = @{
        firstName = "Test"
        lastName = "User"
        email = "test.user@company.com"
        phone = "+1234567890"
        department = "IT"
        position = "Test Engineer"
        salary = 70000
        hireDate = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssZ")
    }
    
    $jsonBody = $newEmployee | ConvertTo-Json
    $headers = @{ "Content-Type" = "application/json" }
    
    $createdEmployee = Invoke-RestMethod -Uri $baseUrl -Method POST -Body $jsonBody -Headers $headers -SkipCertificateCheck
    Write-Host "✅ POST Create Employee: Success - Created employee with ID $($createdEmployee.id)" -ForegroundColor Green
    
    # Test 4: Update Employee
    Write-Host "`n4. Testing PUT /api/employees/$($createdEmployee.id)" -ForegroundColor Cyan
    $updatedEmployee = $newEmployee.Clone()
    $updatedEmployee.position = "Senior Test Engineer"
    $updatedEmployee.salary = 80000
    
    $updateJsonBody = $updatedEmployee | ConvertTo-Json
    $updated = Invoke-RestMethod -Uri "$baseUrl/$($createdEmployee.id)" -Method PUT -Body $updateJsonBody -Headers $headers -SkipCertificateCheck
    Write-Host "✅ PUT Update Employee: Success - Updated position to $($updated.position)" -ForegroundColor Green
    
    # Test 5: Search Employees
    Write-Host "`n5. Testing GET /api/employees?search=Test" -ForegroundColor Cyan
    $searchResults = Invoke-RestMethod -Uri "$baseUrl?search=Test" -Method GET -SkipCertificateCheck
    Write-Host "✅ GET Search Employees: Success - Found $($searchResults.Count) employees matching 'Test'" -ForegroundColor Green
    
    # Test 6: Delete Employee
    Write-Host "`n6. Testing DELETE /api/employees/$($createdEmployee.id)" -ForegroundColor Cyan
    Invoke-RestMethod -Uri "$baseUrl/$($createdEmployee.id)" -Method DELETE -SkipCertificateCheck
    Write-Host "✅ DELETE Employee: Success - Employee deleted" -ForegroundColor Green
    
    Write-Host "`n🎉 All API tests completed successfully!" -ForegroundColor Green
    
} catch {
    Write-Host "❌ API Test Failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Make sure the API is running at https://localhost:7000" -ForegroundColor Yellow
}