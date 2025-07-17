using Microsoft.EntityFrameworkCore;
using EmployeeManagement.API.Data;
using EmployeeManagement.API.Models;
using EmployeeManagement.API.Models.DTOs;

namespace EmployeeManagement.API.Services
{
    public class AttendanceService : IAttendanceService
    {
        private readonly EmployeeContext _context;

        public AttendanceService(EmployeeContext context)
        {
            _context = context;
        }

        public async Task<AttendanceResponseDto?> CheckInAsync(int employeeId, CheckInDto checkInDto)
        {
            // Check if employee exists
            var employee = await _context.Employees
                .FirstOrDefaultAsync(e => e.Id == employeeId && e.IsActive);
            
            if (employee == null)
                return null;

            // Check if already checked in today
            if (await HasCheckedInTodayAsync(employeeId))
                return null;

            // Validate check-in time (7:30 AM - 9:00 AM)
            if (!IsValidCheckInTimeAsync().Result)
                return null;

            var attendance = new Attendance
            {
                EmployeeId = employeeId,
                CheckInTime = DateTime.Now,
                Notes = checkInDto.Notes,
                CreatedAt = DateTime.UtcNow
            };

            _context.Attendances.Add(attendance);
            await _context.SaveChangesAsync();

            return new AttendanceResponseDto
            {
                Id = attendance.Id,
                EmployeeId = attendance.EmployeeId,
                EmployeeName = $"{employee.FirstName} {employee.LastName}",
                CheckInTime = attendance.CheckInTime,
                CheckOutTime = attendance.CheckOutTime,
                WorkingHours = attendance.WorkingHours,
                Notes = attendance.Notes,
                Date = attendance.Date
            };
        }

        public async Task<AttendanceResponseDto?> CheckOutAsync(int employeeId)
        {
            var today = DateOnly.FromDateTime(DateTime.Today);
            
            var attendance = await _context.Attendances
                .Include(a => a.Employee)
                .FirstOrDefaultAsync(a => a.EmployeeId == employeeId && 
                                        a.Date == today && 
                                        a.CheckOutTime == null);

            if (attendance == null)
                return null;

            attendance.CheckOutTime = DateTime.Now;
            attendance.WorkingHours = attendance.CheckOutTime.Value - attendance.CheckInTime;

            await _context.SaveChangesAsync();

            return new AttendanceResponseDto
            {
                Id = attendance.Id,
                EmployeeId = attendance.EmployeeId,
                EmployeeName = $"{attendance.Employee.FirstName} {attendance.Employee.LastName}",
                CheckInTime = attendance.CheckInTime,
                CheckOutTime = attendance.CheckOutTime,
                WorkingHours = attendance.WorkingHours,
                Notes = attendance.Notes,
                Date = attendance.Date
            };
        }

        public async Task<bool> HasCheckedInTodayAsync(int employeeId)
        {
            var today = DateOnly.FromDateTime(DateTime.Today);
            
            return await _context.Attendances
                .AnyAsync(a => a.EmployeeId == employeeId && a.Date == today);
        }

        public async Task<IEnumerable<AttendanceResponseDto>> GetEmployeeAttendanceAsync(int employeeId, DateTime? fromDate = null, DateTime? toDate = null)
        {
            var query = _context.Attendances
                .Include(a => a.Employee)
                .Where(a => a.EmployeeId == employeeId);

            if (fromDate.HasValue)
                query = query.Where(a => a.CheckInTime >= fromDate.Value);

            if (toDate.HasValue)
                query = query.Where(a => a.CheckInTime <= toDate.Value);

            var attendances = await query
                .OrderByDescending(a => a.CheckInTime)
                .ToListAsync();

            return attendances.Select(a => new AttendanceResponseDto
            {
                Id = a.Id,
                EmployeeId = a.EmployeeId,
                EmployeeName = $"{a.Employee.FirstName} {a.Employee.LastName}",
                CheckInTime = a.CheckInTime,
                CheckOutTime = a.CheckOutTime,
                WorkingHours = a.WorkingHours,
                Notes = a.Notes,
                Date = a.Date
            });
        }

        public async Task<AttendanceReportDto?> GetEmployeeAttendanceReportAsync(int employeeId, DateTime? fromDate = null, DateTime? toDate = null)
        {
            var employee = await _context.Employees
                .FirstOrDefaultAsync(e => e.Id == employeeId && e.IsActive);

            if (employee == null)
                return null;

            var attendances = await GetEmployeeAttendanceAsync(employeeId, fromDate, toDate);
            var attendanceList = attendances.ToList();

            var totalWorkingHours = attendanceList
                .Where(a => a.WorkingHours.HasValue)
                .Sum(a => a.WorkingHours!.Value.TotalHours);

            var totalDaysWorked = attendanceList.Count;
            var averageWorkingHours = totalDaysWorked > 0 ? totalWorkingHours / totalDaysWorked : 0;

            return new AttendanceReportDto
            {
                EmployeeId = employeeId,
                EmployeeName = $"{employee.FirstName} {employee.LastName}",
                TotalDaysWorked = totalDaysWorked,
                TotalWorkingHours = TimeSpan.FromHours(totalWorkingHours),
                AverageWorkingHours = TimeSpan.FromHours(averageWorkingHours),
                Attendances = attendanceList
            };
        }

        public async Task<IEnumerable<AttendanceReportDto>> GetAllEmployeesAttendanceReportAsync(DateTime? fromDate = null, DateTime? toDate = null)
        {
            var employees = await _context.Employees
                .Where(e => e.IsActive)
                .ToListAsync();

            var reports = new List<AttendanceReportDto>();

            foreach (var employee in employees)
            {
                var report = await GetEmployeeAttendanceReportAsync(employee.Id, fromDate, toDate);
                if (report != null)
                {
                    reports.Add(report);
                }
            }

            return reports.OrderBy(r => r.EmployeeName);
        }

        public async Task<bool> IsValidCheckInTimeAsync()
        {
            var now = DateTime.Now.TimeOfDay;
            var startTime = new TimeSpan(7, 30, 0); // 7:30 AM
            var endTime = new TimeSpan(9, 0, 0);    // 9:00 AM

            return await Task.FromResult(now >= startTime && now <= endTime);
        }
    }
}