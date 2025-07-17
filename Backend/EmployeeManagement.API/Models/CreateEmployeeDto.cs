using System.ComponentModel.DataAnnotations;

namespace EmployeeManagement.API.Models
{
    public class CreateEmployeeDto
    {
        [Required]
        [StringLength(100)]
        public string FirstName { get; set; } = string.Empty;
        
        [Required]
        [StringLength(100)]
        public string LastName { get; set; } = string.Empty;
        
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        [Phone]
        public string PhoneNumber { get; set; } = string.Empty;
        
        [Required]
        [StringLength(20)]
        public string NationalId { get; set; } = string.Empty;
        
        [Required]
        [Range(18, 100)]
        public int Age { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Department { get; set; } = string.Empty;
        
        [Required]
        [StringLength(100)]
        public string Position { get; set; } = string.Empty;
        
        [Range(0, double.MaxValue)]
        public decimal Salary { get; set; }
        
        public DateTime HireDate { get; set; }
        
        public string? SignatureBase64 { get; set; }
    }
}