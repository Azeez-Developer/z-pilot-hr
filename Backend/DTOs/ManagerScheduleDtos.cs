namespace Backend.DTOs
{
    public class ManagerScheduleShiftDto
    {
        public Guid ShiftId { get; set; }
        public Guid EmployeeId { get; set; }
        public DateOnly ShiftDate { get; set; }
        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }
    }

    public class ManagerScheduleEmployeeDto
    {
        public Guid EmployeeId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public List<ManagerScheduleShiftDto> Shifts { get; set; } = new();
    }

    public class ManagerScheduleResponseDto
    {
        public DateOnly WeekStart { get; set; }
        public DateOnly WeekEnd { get; set; }
        public List<ManagerScheduleEmployeeDto> Employees { get; set; } = new();
    }
}
