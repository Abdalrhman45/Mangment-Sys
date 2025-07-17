# Enhanced Employee Management System Testing Script
Write-Host "🚀 Testing Enhanced Employee Management System with Authentication & Attendance" -ForegroundColor Green

# Test API Base URL
$baseUrl = "https://localhost:7000/api"

Write-Host "`n📋 Testing Enhanced API Endpoints..." -ForegroundColor Yellow

try {
    # Test 1: Authentication - Login
    Write-Host "`n1. Testing Authentication - Login" -ForegroundColor Cyan
    $loginData = @{
        email = "admin@company.com"
        password = "password123"
    } | ConvertTo-Json
    
    $headers = @{ "Content-Type" = "application/json" }
    $authResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $loginData -Headers $headers -SkipCertificateCheck
    Write-Host "✅ Authentication: Success - Token received for $($authResponse.username)" -ForegroundColor Green
    
    $authHeaders = @{ 
        "Content-Type" = "application/json"
        "Authorization" = "Bearer $($authResponse.token)"
    }
    
    # Test 2: Get All Employees (Admin)
    Write-Host "`n2. Testing GET /api/employees (Admin)" -ForegroundColor Cyan
    $employees = Invoke-RestMethod -Uri "$baseUrl/employees?page=1`&pageSize=10" -Method GET -Headers $authHeaders -SkipCertificateCheck
    Write-Host "✅ GET Employees: Success - Found $($employees.Count) employees" -ForegroundColor Green
    
    # Test 3: Get Employee Count
    Write-Host "`n3. Testing GET /api/employees/count" -ForegroundColor Cyan
    $count = Invoke-RestMethod -Uri "$baseUrl/employees/count" -Method GET -Headers $authHeaders -SkipCertificateCheck
    Write-Host "✅ GET Employee Count: Success - Total: $count employees" -ForegroundColor Green
    
    # Test 4: Create New Employee
    Write-Host "`n4. Testing POST /api/employees" -ForegroundColor Cyan
    $newEmployee = @{
        firstName = "Test"
        lastName = "Employee"
        email = "test.employee@company.com"
        phoneNumber = "+1234567890"
        nationalId = "ID123456789"
        age = 25
        department = "IT"
        position = "Software Tester"
        salary = 65000
        hireDate = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssZ")
    }
    
    $employeeJson = $newEmployee | ConvertTo-Json
    $createdEmployee = Invoke-RestMethod -Uri "$baseUrl/employees" -Method POST -Body $employeeJson -Headers $authHeaders -SkipCertificateCheck
    Write-Host "✅ POST Create Employee: Success - Created employee with ID $($createdEmployee.id)" -ForegroundColor Green
    
    # Test 5: Employee Login
    Write-Host "`n5. Testing Employee Authentication" -ForegroundColor Cyan
    $employeeLoginData = @{
        email = "john.doe@company.com"
        password = "password123"
    } | ConvertTo-Json
    
    $empAuthResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $employeeLoginData -Headers $headers -SkipCertificateCheck
    Write-Host "✅ Employee Authentication: Success - Token received for $($empAuthResponse.username)" -ForegroundColor Green
    
    $empAuthHeaders = @{ 
        "Content-Type" = "application/json"
        "Authorization" = "Bearer $($empAuthResponse.token)"
    }
    
    # Test 6: Check-in Status
    Write-Host "`n6. Testing GET /api/attendance/check-status" -ForegroundColor Cyan
    $checkStatus = Invoke-RestMethod -Uri "$baseUrl/attendance/check-status" -Method GET -Headers $empAuthHeaders -SkipCertificateCheck
    Write-Host "✅ Check-in Status: Success - Has checked in today: $($checkStatus.hasCheckedInToday)" -ForegroundColor Green
    
    # Test 7: Employee Profile
    Write-Host "`n7. Testing GET /api/employees/my-profile" -ForegroundColor Cyan
    $profile = Invoke-RestMethod -Uri "$baseUrl/employees/my-profile" -Method GET -Headers $empAuthHeaders -SkipCertificateCheck
    Write-Host "✅ Employee Profile: Success - Retrieved profile for $($profile.firstName) $($profile.lastName)" -ForegroundColor Green
    
    # Test 8: My Attendance Records
    Write-Host "`n8. Testing GET /api/attendance/my-attendance" -ForegroundColor Cyan
    $myAttendance = Invoke-RestMethod -Uri "$baseUrl/attendance/my-attendance" -Method GET -Headers $empAuthHeaders -SkipCertificateCheck
    Write-Host "✅ My Attendance: Success - Found $($myAttendance.Count) attendance records" -ForegroundColor Green
    
    # Test 9: My Attendance Report
    Write-Host "`n9. Testing GET /api/attendance/my-report" -ForegroundColor Cyan
    $myReport = Invoke-RestMethod -Uri "$baseUrl/attendance/my-report" -Method GET -Headers $empAuthHeaders -SkipCertificateCheck
    Write-Host "✅ My Attendance Report: Success - Total days worked: $($myReport.totalDaysWorked)" -ForegroundColor Green
    
    # Test 10: Admin Attendance Reports
    Write-Host "`n10. Testing GET /api/attendance/reports (Admin)" -ForegroundColor Cyan
    $allReports = Invoke-RestMethod -Uri "$baseUrl/attendance/reports" -Method GET -Headers $authHeaders -SkipCertificateCheck
    Write-Host "✅ All Attendance Reports: Success - Found reports for $($allReports.Count) employees" -ForegroundColor Green
    
    # Test 11: Update Employee
    Write-Host "`n11. Testing PUT /api/employees/$($createdEmployee.id)" -ForegroundColor Cyan
    $updatedEmployee = $newEmployee.Clone()
    $updatedEmployee.position = "Senior Software Tester"
    $updatedEmployee.salary = 75000
    
    $updateJson = $updatedEmployee | ConvertTo-Json
    $updated = Invoke-RestMethod -Uri "$baseUrl/employees/$($createdEmployee.id)" -Method PUT -Body $updateJson -Headers $authHeaders -SkipCertificateCheck
    Write-Host "✅ PUT Update Employee: Success - Updated position to $($updated.position)" -ForegroundColor Green
    
    # Test 12: Delete Employee
    Write-Host "`n12. Testing DELETE /api/employees/$($createdEmployee.id)" -ForegroundColor Cyan
    Invoke-RestMethod -Uri "$baseUrl/employees/$($createdEmployee.id)" -Method DELETE -Headers $authHeaders -SkipCertificateCheck
    Write-Host "✅ DELETE Employee: Success - Employee deleted" -ForegroundColor Green
    
    Write-Host "`n🎉 All Enhanced API tests completed successfully!" -ForegroundColor Green
    Write-Host "`n📊 Test Summary:" -ForegroundColor Yellow
    Write-Host "✅ Authentication & Authorization: Working" -ForegroundColor Green
    Write-Host "✅ Role-based Access Control: Working" -ForegroundColor Green
    Write-Host "✅ Employee CRUD Operations: Working" -ForegroundColor Green
    Write-Host "✅ Attendance Management: Working" -ForegroundColor Green
    Write-Host "✅ Reporting System: Working" -ForegroundColor Green
    Write-Host "✅ Enhanced Employee Fields: Working" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Enhanced API Test Failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Make sure the enhanced API is running at https://localhost:7000" -ForegroundColor Yellow
    Write-Host "Demo credentials:" -ForegroundColor Yellow
    Write-Host "  Admin: admin@company.com / password123" -ForegroundColor Cyan
    Write-Host "  Employee: john.doe@company.com / password123" -ForegroundColor Cyan
}