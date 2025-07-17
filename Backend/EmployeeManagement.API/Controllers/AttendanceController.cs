using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using EmployeeManagement.API.Models.DTOs;
using EmployeeManagement.API.Services;

namespace EmployeeManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AttendanceController : ControllerBase
    {
        private readonly IAttendanceService _attendanceService;

        public AttendanceController(IAttendanceService attendanceService)
        {
            _attendanceService = attendanceService;
        }

        [HttpPost("checkin")]
        [Authorize(Roles = "Employee")]
        public async Task<ActionResult<AttendanceResponseDto>> CheckIn(CheckInDto checkInDto)
        {
            try
            {
                var employeeIdClaim = User.FindFirst("EmployeeId")?.Value;
                if (string.IsNullOrEmpty(employeeIdClaim) || !int.TryParse(employeeIdClaim, out int employeeId))
                {
                    return BadRequest(new { message = "Employee ID not found in token" });
                }

                // Check if valid check-in time
                if (!await _attendanceService.IsValidCheckInTimeAsync())
                {
                    return BadRequest(new { message = "Check-in is only allowed between 7:30 AM and 9:00 AM" });
                }

                // Check if already checked in today
                if (await _attendanceService.HasCheckedInTodayAsync(employeeId))
                {
                    return BadRequest(new { message = "You have already checked in today" });
                }

                var result = await _attendanceService.CheckInAsync(employeeId, checkInDto);
                
                if (result == null)
                    return BadRequest(new { message = "Unable to check in" });

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        [HttpPost("checkout")]
        [Authorize(Roles = "Employee")]
        public async Task<ActionResult<AttendanceResponseDto>> CheckOut()
        {
            try
            {
                var employeeIdClaim = User.FindFirst("EmployeeId")?.Value;
                if (string.IsNullOrEmpty(employeeIdClaim) || !int.TryParse(employeeIdClaim, out int employeeId))
                {
                    return BadRequest(new { message = "Employee ID not found in token" });
                }

                var result = await _attendanceService.CheckOutAsync(employeeId);
                
                if (result == null)
                    return BadRequest(new { message = "No active check-in found for today" });

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        [HttpGet("my-attendance")]
        [Authorize(Roles = "Employee")]
        public async Task<ActionResult<IEnumerable<AttendanceResponseDto>>> GetMyAttendance(
            [FromQuery] DateTime? fromDate = null, 
            [FromQuery] DateTime? toDate = null)
        {
            try
            {
                var employeeIdClaim = User.FindFirst("EmployeeId")?.Value;
                if (string.IsNullOrEmpty(employeeIdClaim) || !int.TryParse(employeeIdClaim, out int employeeId))
                {
                    return BadRequest(new { message = "Employee ID not found in token" });
                }

                var result = await _attendanceService.GetEmployeeAttendanceAsync(employeeId, fromDate, toDate);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        [HttpGet("my-report")]
        [Authorize(Roles = "Employee")]
        public async Task<ActionResult<AttendanceReportDto>> GetMyAttendanceReport(
            [FromQuery] DateTime? fromDate = null, 
            [FromQuery] DateTime? toDate = null)
        {
            try
            {
                var employeeIdClaim = User.FindFirst("EmployeeId")?.Value;
                if (string.IsNullOrEmpty(employeeIdClaim) || !int.TryParse(employeeIdClaim, out int employeeId))
                {
                    return BadRequest(new { message = "Employee ID not found in token" });
                }

                var result = await _attendanceService.GetEmployeeAttendanceReportAsync(employeeId, fromDate, toDate);
                
                if (result == null)
                    return NotFound(new { message = "Employee not found" });

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        [HttpGet("employee/{employeeId}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<AttendanceResponseDto>>> GetEmployeeAttendance(
            int employeeId,
            [FromQuery] DateTime? fromDate = null, 
            [FromQuery] DateTime? toDate = null)
        {
            try
            {
                var result = await _attendanceService.GetEmployeeAttendanceAsync(employeeId, fromDate, toDate);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        [HttpGet("reports")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<AttendanceReportDto>>> GetAllAttendanceReports(
            [FromQuery] DateTime? fromDate = null, 
            [FromQuery] DateTime? toDate = null)
        {
            try
            {
                var result = await _attendanceService.GetAllEmployeesAttendanceReportAsync(fromDate, toDate);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        [HttpGet("check-status")]
        [Authorize(Roles = "Employee")]
        public async Task<ActionResult> GetCheckInStatus()
        {
            try
            {
                var employeeIdClaim = User.FindFirst("EmployeeId")?.Value;
                if (string.IsNullOrEmpty(employeeIdClaim) || !int.TryParse(employeeIdClaim, out int employeeId))
                {
                    return BadRequest(new { message = "Employee ID not found in token" });
                }

                var hasCheckedIn = await _attendanceService.HasCheckedInTodayAsync(employeeId);
                var isValidTime = await _attendanceService.IsValidCheckInTimeAsync();

                return Ok(new { 
                    hasCheckedInToday = hasCheckedIn,
                    isValidCheckInTime = isValidTime,
                    currentTime = DateTime.Now.ToString("HH:mm:ss"),
                    allowedCheckInTime = "07:30:00 - 09:00:00"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }
    }
}