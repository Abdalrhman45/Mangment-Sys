using Microsoft.AspNetCore.Mvc;
using EmployeeManagement.API.Models.DTOs;
using EmployeeManagement.API.Services;

namespace EmployeeManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login(LoginDto loginDto)
        {
            try
            {
                var result = await _authService.LoginAsync(loginDto);
                
                if (result == null)
                    return Unauthorized(new { message = "Invalid email or password" });

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponseDto>> Register(RegisterDto registerDto)
        {
            try
            {
                var result = await _authService.RegisterAsync(registerDto);
                
                if (result == null)
                    return BadRequest(new { message = "User already exists or invalid employee ID" });

                return CreatedAtAction(nameof(Login), result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        [HttpPost("validate-token")]
        public async Task<ActionResult> ValidateToken([FromBody] string token)
        {
            try
            {
                var isValid = await _authService.ValidateTokenAsync(token);
                
                if (!isValid)
                    return Unauthorized(new { message = "Invalid token" });

                return Ok(new { message = "Token is valid" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }
    }
}