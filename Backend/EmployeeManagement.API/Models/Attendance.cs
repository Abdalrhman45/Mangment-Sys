using System.ComponentModel.DataAnnotations;

namespace EmployeeManagement.API.Models
{
    public class Attendance
    {
        public int Id { get; set; }
        
        [Required]
        public int EmployeeId { get; set; }
        public Employee Employee { get; set; } = null!;
        
        [Required]
        public DateTime CheckInTime { get; set; }
        
        public DateTime? CheckOutTime { get; set; }
        
        public TimeSpan? WorkingHours { get; set; }
        
        public string? Notes { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Computed property for date only
        public DateOnly Date => DateOnly.FromDateTime(CheckInTime);
    }
}