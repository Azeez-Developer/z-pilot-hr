using System;

namespace Backend.Models
{
    public class Shift
    {
        public Guid Id { get; set; }

        // Foreign Keys
        public Guid EmployeeId { get; set; }
        public Guid ManagerId { get; set; }

        // Navigation Properties (nullable – loaded by EF)
        public User? Employee { get; set; }
        public User? Manager { get; set; }

        // Shift details
        public DateOnly ShiftDate { get; set; }
        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }

        // Audit fields
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
