using EmployeeManagement.API.Models;
using EmployeeManagement.API.Models.DTOs;

namespace EmployeeManagement.API.Services
{
    public interface IAttendanceService
    {
        Task<AttendanceResponseDto?> CheckInAsync(int employeeId, CheckInDto checkInDto);
        Task<AttendanceResponseDto?> CheckOutAsync(int employeeId);
        Task<bool> HasCheckedInTodayAsync(int employeeId);
        Task<IEnumerable<AttendanceResponseDto>> GetEmployeeAttendanceAsync(int employeeId, DateTime? fromDate = null, DateTime? toDate = null);
        Task<AttendanceReportDto?> GetEmployeeAttendanceReportAsync(int employeeId, DateTime? fromDate = null, DateTime? toDate = null);
        Task<IEnumerable<AttendanceReportDto>> GetAllEmployeesAttendanceReportAsync(DateTime? fromDate = null, DateTime? toDate = null);
        Task<bool> IsValidCheckInTimeAsync();
    }
}