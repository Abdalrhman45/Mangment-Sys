using System.ComponentModel.DataAnnotations;

namespace EmployeeManagement.API.Models.DTOs
{
    public class RegisterDto
    {
        [Required]
        [StringLength(100)]
        public string Username { get; set; } = string.Empty;
        
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        [MinLength(6)]
        public string Password { get; set; } = string.Empty;
        
        [Required]
        public string Role { get; set; } = "Employee";
        
        public int? EmployeeId { get; set; }
    }
}