using EmployeeManagement.API.Models;

namespace EmployeeManagement.API.Services
{
    public interface IEmployeeService
    {
        Task<IEnumerable<Employee>> GetAllEmployeesAsync(int page = 1, int pageSize = 10, string? sortBy = null, bool sortDescending = false);
        Task<Employee?> GetEmployeeByIdAsync(int id);
        Task<Employee> CreateEmployeeAsync(CreateEmployeeDto employeeDto);
        Task<Employee?> UpdateEmployeeAsync(int id, CreateEmployeeDto employeeDto);
        Task<Employee?> UpdateEmployeeSignatureAsync(int id, string signatureBase64);
        Task<bool> DeleteEmployeeAsync(int id);
        Task<IEnumerable<Employee>> SearchEmployeesAsync(string searchTerm, int page = 1, int pageSize = 10, string? sortBy = null, bool sortDescending = false);
        Task<int> GetEmployeesCountAsync(string? searchTerm = null);
    }
}