using System;

namespace Backend.DTOs
{
    public class CreateShiftRequestDto
    {
        public Guid EmployeeId { get; set; }
        public DateOnly ShiftDate { get; set; }
        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }
    }
}
