using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using EmployeeManagement.API.Models;
using EmployeeManagement.API.Services;

namespace EmployeeManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class EmployeesController : ControllerBase
    {
        private readonly IEmployeeService _employeeService;

        public EmployeesController(IEmployeeService employeeService)
        {
            _employeeService = employeeService;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<Employee>>> GetEmployees(
            [FromQuery] string? search = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? sortBy = null,
            [FromQuery] bool sortDescending = false)
        {
            try
            {
                var employees = string.IsNullOrEmpty(search) 
                    ? await _employeeService.GetAllEmployeesAsync(page, pageSize, sortBy, sortDescending)
                    : await _employeeService.SearchEmployeesAsync(search, page, pageSize, sortBy, sortDescending);
                
                return Ok(employees);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        [HttpGet("count")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<int>> GetEmployeesCount([FromQuery] string? search = null)
        {
            try
            {
                var count = await _employeeService.GetEmployeesCountAsync(search);
                return Ok(count);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Employee>> GetEmployee(int id)
        {
            try
            {
                // Employees can only view their own profile, Admins can view any
                var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
                if (userRole == "Employee")
                {
                    var employeeIdClaim = User.FindFirst("EmployeeId")?.Value;
                    if (string.IsNullOrEmpty(employeeIdClaim) || !int.TryParse(employeeIdClaim, out int currentEmployeeId) || currentEmployeeId != id)
                    {
                        return Forbid("You can only view your own profile");
                    }
                }

                var employee = await _employeeService.GetEmployeeByIdAsync(id);
                
                if (employee == null)
                    return NotFound(new { message = $"Employee with ID {id} not found" });
                
                return Ok(employee);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        [HttpGet("my-profile")]
        [Authorize(Roles = "Employee")]
        public async Task<ActionResult<Employee>> GetMyProfile()
        {
            try
            {
                var employeeIdClaim = User.FindFirst("EmployeeId")?.Value;
                if (string.IsNullOrEmpty(employeeIdClaim) || !int.TryParse(employeeIdClaim, out int employeeId))
                {
                    return BadRequest(new { message = "Employee ID not found in token" });
                }

                var employee = await _employeeService.GetEmployeeByIdAsync(employeeId);
                
                if (employee == null)
                    return NotFound(new { message = "Employee profile not found" });
                
                return Ok(employee);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Employee>> CreateEmployee(CreateEmployeeDto employeeDto)
        {
            try
            {
                var employee = await _employeeService.CreateEmployeeAsync(employeeDto);
                return CreatedAtAction(nameof(GetEmployee), new { id = employee.Id }, employee);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Employee>> UpdateEmployee(int id, CreateEmployeeDto employeeDto)
        {
            try
            {
                var employee = await _employeeService.UpdateEmployeeAsync(id, employeeDto);
                
                if (employee == null)
                    return NotFound(new { message = $"Employee with ID {id} not found" });
                
                return Ok(employee);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        [HttpPut("update-signature/{id}")]
        public async Task<ActionResult<Employee>> UpdateEmployeeSignature(int id, [FromBody] string signatureBase64)
        {
            try
            {
                // Employees can only update their own signature, Admins can update any
                var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
                if (userRole == "Employee")
                {
                    var employeeIdClaim = User.FindFirst("EmployeeId")?.Value;
                    if (string.IsNullOrEmpty(employeeIdClaim) || !int.TryParse(employeeIdClaim, out int currentEmployeeId) || currentEmployeeId != id)
                    {
                        return Forbid("You can only update your own signature");
                    }
                }

                var employee = await _employeeService.UpdateEmployeeSignatureAsync(id, signatureBase64);
                
                if (employee == null)
                    return NotFound(new { message = $"Employee with ID {id} not found" });
                
                return Ok(employee);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            try
            {
                var result = await _employeeService.DeleteEmployeeAsync(id);
                
                if (!result)
                    return NotFound(new { message = $"Employee with ID {id} not found" });
                
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }
    }
}