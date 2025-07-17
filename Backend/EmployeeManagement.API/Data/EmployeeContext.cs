using Microsoft.EntityFrameworkCore;
using EmployeeManagement.API.Models;

namespace EmployeeManagement.API.Data
{
    public class EmployeeContext : DbContext
    {
        public EmployeeContext(DbContextOptions<EmployeeContext> options) : base(options)
        {
        }

        public DbSet<Employee> Employees { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Attendance> Attendances { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Employee configuration
            modelBuilder.Entity<Employee>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Salary).HasPrecision(18, 2);
                entity.HasIndex(e => e.Email).IsUnique();
                entity.HasIndex(e => e.NationalId).IsUnique();
                
                // One-to-one relationship with User
                entity.HasOne(e => e.User)
                      .WithOne(u => u.Employee)
                      .HasForeignKey<User>(u => u.EmployeeId)
                      .OnDelete(DeleteBehavior.SetNull);
                
                // One-to-many relationship with Attendance
                entity.HasMany(e => e.Attendances)
                      .WithOne(a => a.Employee)
                      .HasForeignKey(a => a.EmployeeId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // User configuration
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(u => u.Id);
                entity.HasIndex(u => u.Email).IsUnique();
                entity.HasIndex(u => u.Username).IsUnique();
            });

            // Attendance configuration
            modelBuilder.Entity<Attendance>(entity =>
            {
                entity.HasKey(a => a.Id);
                entity.HasIndex(a => new { a.EmployeeId, a.CheckInTime });
            });

            // Seed data
            var employees = new[]
            {
                new Employee
                {
                    Id = 1,
                    FirstName = "John",
                    LastName = "Doe",
                    Email = "john.doe@company.com",
                    PhoneNumber = "+1234567890",
                    NationalId = "ID001234567",
                    Age = 30,
                    Department = "IT",
                    Position = "Software Developer",
                    Salary = 75000,
                    HireDate = DateTime.UtcNow.AddYears(-2),
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new Employee
                {
                    Id = 2,
                    FirstName = "Jane",
                    LastName = "Smith",
                    Email = "jane.smith@company.com",
                    PhoneNumber = "+1234567891",
                    NationalId = "ID001234568",
                    Age = 28,
                    Department = "HR",
                    Position = "HR Manager",
                    Salary = 85000,
                    HireDate = DateTime.UtcNow.AddYears(-3),
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new Employee
                {
                    Id = 3,
                    FirstName = "Admin",
                    LastName = "User",
                    Email = "admin@company.com",
                    PhoneNumber = "+1234567892",
                    NationalId = "ID001234569",
                    Age = 35,
                    Department = "Management",
                    Position = "System Administrator",
                    Salary = 95000,
                    HireDate = DateTime.UtcNow.AddYears(-5),
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                }
            };

            modelBuilder.Entity<Employee>().HasData(employees);

            // Seed users (passwords are hashed for "password123")
            // Using a consistent hash for demo purposes
            var passwordHash = "AQIDBAUGBwgJCgsMDQ4PEBESExQVFhcYGRobHB0eHyAhIiMkJSYnKCkqKywtLi8wMTIzNDU2Nzg5Ojs8PT4/QA==";
            
            var users = new[]
            {
                new User
                {
                    Id = 1,
                    Username = "john.doe",
                    Email = "john.doe@company.com",
                    PasswordHash = passwordHash, // password123
                    Role = "Employee",
                    EmployeeId = 1,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new User
                {
                    Id = 2,
                    Username = "jane.smith",
                    Email = "jane.smith@company.com",
                    PasswordHash = passwordHash, // password123
                    Role = "Employee",
                    EmployeeId = 2,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new User
                {
                    Id = 3,
                    Username = "admin",
                    Email = "admin@company.com",
                    PasswordHash = passwordHash, // password123
                    Role = "Admin",
                    EmployeeId = 3,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                }
            };

            modelBuilder.Entity<User>().HasData(users);
        }
    }
}