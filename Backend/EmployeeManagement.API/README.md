# Employee Management API

.NET 8 Web API for managing employee data with Entity Framework Core.

## Quick Start

```bash
# Restore packages
dotnet restore

# Run the application
dotnet run

# Access Swagger UI
# Navigate to https://localhost:7000/swagger
```

## API Endpoints

### Get All Employees
```http
GET /api/employees
GET /api/employees?search=john
```

### Get Employee by ID
```http
GET /api/employees/1
```

### Create Employee
```http
POST /api/employees
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@company.com",
  "phone": "+1234567890",
  "department": "IT",
  "position": "Software Developer",
  "salary": 75000,
  "hireDate": "2024-01-15T00:00:00Z"
}
```

### Update Employee
```http
PUT /api/employees/1
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@company.com",
  "phone": "+1234567890",
  "department": "IT",
  "position": "Senior Software Developer",
  "salary": 85000,
  "hireDate": "2024-01-15T00:00:00Z"
}
```

### Delete Employee
```http
DELETE /api/employees/1
```

## Configuration

The API is configured with:
- In-Memory Database (Entity Framework Core)
- CORS enabled for Angular frontend
- Swagger/OpenAPI documentation
- Comprehensive error handling
- Model validation

## Database Schema

The Employee entity includes:
- Primary key (Id)
- Personal information (FirstName, LastName, Email, Phone)
- Job details (Department, Position, Salary, HireDate)
- Status tracking (IsActive, CreatedAt, UpdatedAt)
- Unique email constraint