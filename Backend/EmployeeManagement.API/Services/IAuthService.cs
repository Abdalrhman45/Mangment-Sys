using EmployeeManagement.API.Models;
using EmployeeManagement.API.Models.DTOs;

namespace EmployeeManagement.API.Services
{
    public interface IAuthService
    {
        Task<AuthResponseDto?> LoginAsync(LoginDto loginDto);
        Task<AuthResponseDto?> RegisterAsync(RegisterDto registerDto);
        Task<User?> GetUserByIdAsync(int userId);
        Task<User?> GetUserByEmailAsync(string email);
        string GenerateJwtToken(User user);
        Task<bool> ValidateTokenAsync(string token);
    }
}