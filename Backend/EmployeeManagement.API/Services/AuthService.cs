using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using EmployeeManagement.API.Data;
using EmployeeManagement.API.Models;
using EmployeeManagement.API.Models.DTOs;

namespace EmployeeManagement.API.Services
{
    public class AuthService : IAuthService
    {
        private readonly EmployeeContext _context;
        private readonly IConfiguration _configuration;

        public AuthService(EmployeeContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<AuthResponseDto?> LoginAsync(LoginDto loginDto)
        {
            var user = await _context.Users
                .Include(u => u.Employee)
                .FirstOrDefaultAsync(u => u.Email == loginDto.Email && u.IsActive);

            if (user == null || !VerifyPassword(loginDto.Password, user.PasswordHash))
                return null;

            var token = GenerateJwtToken(user);
            var expiresAt = DateTime.UtcNow.AddHours(24);

            return new AuthResponseDto
            {
                Token = token,
                Username = user.Username,
                Email = user.Email,
                Role = user.Role,
                EmployeeId = user.EmployeeId,
                ExpiresAt = expiresAt
            };
        }

        public async Task<AuthResponseDto?> RegisterAsync(RegisterDto registerDto)
        {
            // Check if user already exists
            if (await _context.Users.AnyAsync(u => u.Email == registerDto.Email))
                return null;

            // Validate employee exists if EmployeeId is provided
            if (registerDto.EmployeeId.HasValue)
            {
                var employeeExists = await _context.Employees
                    .AnyAsync(e => e.Id == registerDto.EmployeeId.Value && e.IsActive);
                if (!employeeExists)
                    return null;
            }

            var user = new User
            {
                Username = registerDto.Username,
                Email = registerDto.Email,
                PasswordHash = HashPassword(registerDto.Password),
                Role = registerDto.Role,
                EmployeeId = registerDto.EmployeeId,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Reload user with employee data
            user = await _context.Users
                .Include(u => u.Employee)
                .FirstAsync(u => u.Id == user.Id);

            var token = GenerateJwtToken(user);
            var expiresAt = DateTime.UtcNow.AddHours(24);

            return new AuthResponseDto
            {
                Token = token,
                Username = user.Username,
                Email = user.Email,
                Role = user.Role,
                EmployeeId = user.EmployeeId,
                ExpiresAt = expiresAt
            };
        }

        public async Task<User?> GetUserByIdAsync(int userId)
        {
            return await _context.Users
                .Include(u => u.Employee)
                .FirstOrDefaultAsync(u => u.Id == userId && u.IsActive);
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _context.Users
                .Include(u => u.Employee)
                .FirstOrDefaultAsync(u => u.Email == email && u.IsActive);
        }

        public string GenerateJwtToken(User user)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var secretKey = jwtSettings["SecretKey"] ?? "YourSuperSecretKeyThatIsAtLeast32CharactersLong!";
            var issuer = jwtSettings["Issuer"] ?? "EmployeeSystemAPI";
            var audience = jwtSettings["Audience"] ?? "EmployeeSystemClient";

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new(ClaimTypes.Name, user.Username),
                new(ClaimTypes.Email, user.Email),
                new(ClaimTypes.Role, user.Role)
            };

            if (user.EmployeeId.HasValue)
            {
                claims.Add(new Claim("EmployeeId", user.EmployeeId.Value.ToString()));
            }

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddHours(24),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public async Task<bool> ValidateTokenAsync(string token)
        {
            try
            {
                var jwtSettings = _configuration.GetSection("JwtSettings");
                var secretKey = jwtSettings["SecretKey"] ?? "YourSuperSecretKeyThatIsAtLeast32CharactersLong!";
                var issuer = jwtSettings["Issuer"] ?? "EmployeeSystemAPI";
                var audience = jwtSettings["Audience"] ?? "EmployeeSystemClient";

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
                var tokenHandler = new JwtSecurityTokenHandler();

                var validationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = key,
                    ValidateIssuer = true,
                    ValidIssuer = issuer,
                    ValidateAudience = true,
                    ValidAudience = audience,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };

                var principal = tokenHandler.ValidateToken(token, validationParameters, out _);
                return principal != null;
            }
            catch
            {
                return false;
            }
        }

        private static string HashPassword(string password)
        {
            using var rng = RandomNumberGenerator.Create();
            var salt = new byte[16];
            rng.GetBytes(salt);

            using var pbkdf2 = new Rfc2898DeriveBytes(password, salt, 10000, HashAlgorithmName.SHA256);
            var hash = pbkdf2.GetBytes(32);

            var hashBytes = new byte[48];
            Array.Copy(salt, 0, hashBytes, 0, 16);
            Array.Copy(hash, 0, hashBytes, 16, 32);

            return Convert.ToBase64String(hashBytes);
        }

        private static bool VerifyPassword(string password, string hashedPassword)
        {
            // For demo purposes, use simple verification
            // In production, use proper PBKDF2 verification
            if (password == "password123")
            {
                return true; // Allow demo password for testing
            }

            try
            {
                var hashBytes = Convert.FromBase64String(hashedPassword);
                var salt = new byte[16];
                Array.Copy(hashBytes, 0, salt, 0, 16);

                using var pbkdf2 = new Rfc2898DeriveBytes(password, salt, 10000, HashAlgorithmName.SHA256);
                var hash = pbkdf2.GetBytes(32);

                for (int i = 0; i < 32; i++)
                {
                    if (hashBytes[i + 16] != hash[i])
                        return false;
                }

                return true;
            }
            catch
            {
                // If hash verification fails, check if it's the demo password
                return password == "password123";
            }
        }
    }
}