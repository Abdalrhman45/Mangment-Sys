using System.ComponentModel.DataAnnotations;

namespace EmployeeManagement.API.Models.DTOs
{
    public class CheckInDto
    {
        public string? Notes { get; set; }
    }

    public class AttendanceResponseDto
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public string EmployeeName { get; set; } = string.Empty;
        public DateTime CheckInTime { get; set; }
        public DateTime? CheckOutTime { get; set; }
        public TimeSpan? WorkingHours { get; set; }
        public string? Notes { get; set; }
        public DateOnly Date { get; set; }
    }

    public class AttendanceReportDto
    {
        public int EmployeeId { get; set; }
        public string EmployeeName { get; set; } = string.Empty;
        public int TotalDaysWorked { get; set; }
        public TimeSpan TotalWorkingHours { get; set; }
        public TimeSpan AverageWorkingHours { get; set; }
        public List<AttendanceResponseDto> Attendances { get; set; } = new();
    }
}