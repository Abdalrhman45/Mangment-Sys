using Microsoft.EntityFrameworkCore;
using EmployeeManagement.API.Data;
using EmployeeManagement.API.Models;

namespace EmployeeManagement.API.Services
{
    public class EmployeeService : IEmployeeService
    {
        private readonly EmployeeContext _context;

        public EmployeeService(EmployeeContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Employee>> GetAllEmployeesAsync(int page = 1, int pageSize = 10, string? sortBy = null, bool sortDescending = false)
        {
            var query = _context.Employees.Where(e => e.IsActive);

            // Apply sorting
            query = ApplySorting(query, sortBy, sortDescending);

            // Apply pagination
            return await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<Employee?> GetEmployeeByIdAsync(int id)
        {
            return await _context.Employees
                .FirstOrDefaultAsync(e => e.Id == id && e.IsActive);
        }

        public async Task<Employee> CreateEmployeeAsync(CreateEmployeeDto employeeDto)
        {
            var employee = new Employee
            {
                FirstName = employeeDto.FirstName,
                LastName = employeeDto.LastName,
                Email = employeeDto.Email,
                PhoneNumber = employeeDto.PhoneNumber,
                NationalId = employeeDto.NationalId,
                Age = employeeDto.Age,
                Department = employeeDto.Department,
                Position = employeeDto.Position,
                Salary = employeeDto.Salary,
                HireDate = employeeDto.HireDate,
                SignatureBase64 = employeeDto.SignatureBase64,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();
            return employee;
        }

        public async Task<Employee?> UpdateEmployeeAsync(int id, CreateEmployeeDto employeeDto)
        {
            var employee = await _context.Employees
                .FirstOrDefaultAsync(e => e.Id == id && e.IsActive);

            if (employee == null)
                return null;

            employee.FirstName = employeeDto.FirstName;
            employee.LastName = employeeDto.LastName;
            employee.Email = employeeDto.Email;
            employee.PhoneNumber = employeeDto.PhoneNumber;
            employee.NationalId = employeeDto.NationalId;
            employee.Age = employeeDto.Age;
            employee.Department = employeeDto.Department;
            employee.Position = employeeDto.Position;
            employee.Salary = employeeDto.Salary;
            employee.HireDate = employeeDto.HireDate;
            employee.SignatureBase64 = employeeDto.SignatureBase64;
            employee.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return employee;
        }

        public async Task<bool> DeleteEmployeeAsync(int id)
        {
            var employee = await _context.Employees
                .FirstOrDefaultAsync(e => e.Id == id && e.IsActive);

            if (employee == null)
                return false;

            employee.IsActive = false;
            employee.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<Employee>> SearchEmployeesAsync(string searchTerm, int page = 1, int pageSize = 10, string? sortBy = null, bool sortDescending = false)
        {
            var query = _context.Employees
                .Where(e => e.IsActive && 
                    (e.FirstName.Contains(searchTerm) ||
                     e.LastName.Contains(searchTerm) ||
                     e.Email.Contains(searchTerm) ||
                     e.Department.Contains(searchTerm) ||
                     e.Position.Contains(searchTerm) ||
                     e.NationalId.Contains(searchTerm)));

            // Apply sorting
            query = ApplySorting(query, sortBy, sortDescending);

            // Apply pagination
            return await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<Employee?> UpdateEmployeeSignatureAsync(int id, string signatureBase64)
        {
            var employee = await _context.Employees
                .FirstOrDefaultAsync(e => e.Id == id && e.IsActive);

            if (employee == null)
                return null;

            employee.SignatureBase64 = signatureBase64;
            employee.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return employee;
        }

        public async Task<int> GetEmployeesCountAsync(string? searchTerm = null)
        {
            var query = _context.Employees.Where(e => e.IsActive);

            if (!string.IsNullOrEmpty(searchTerm))
            {
                query = query.Where(e => 
                    e.FirstName.Contains(searchTerm) ||
                    e.LastName.Contains(searchTerm) ||
                    e.Email.Contains(searchTerm) ||
                    e.Department.Contains(searchTerm) ||
                    e.Position.Contains(searchTerm) ||
                    e.NationalId.Contains(searchTerm));
            }

            return await query.CountAsync();
        }

        private static IQueryable<Employee> ApplySorting(IQueryable<Employee> query, string? sortBy, bool sortDescending)
        {
            return sortBy?.ToLower() switch
            {
                "firstname" => sortDescending ? query.OrderByDescending(e => e.FirstName) : query.OrderBy(e => e.FirstName),
                "lastname" => sortDescending ? query.OrderByDescending(e => e.LastName) : query.OrderBy(e => e.LastName),
                "email" => sortDescending ? query.OrderByDescending(e => e.Email) : query.OrderBy(e => e.Email),
                "department" => sortDescending ? query.OrderByDescending(e => e.Department) : query.OrderBy(e => e.Department),
                "position" => sortDescending ? query.OrderByDescending(e => e.Position) : query.OrderBy(e => e.Position),
                "salary" => sortDescending ? query.OrderByDescending(e => e.Salary) : query.OrderBy(e => e.Salary),
                "hiredate" => sortDescending ? query.OrderByDescending(e => e.HireDate) : query.OrderBy(e => e.HireDate),
                "age" => sortDescending ? query.OrderByDescending(e => e.Age) : query.OrderBy(e => e.Age),
                _ => query.OrderBy(e => e.LastName)
            };
        }    }

}