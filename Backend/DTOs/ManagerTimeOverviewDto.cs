namespace Backend.DTOs
{
    public class ManagerTimeOverviewDto
    {
        public Guid UserId { get; set; }

        public string FullName { get; set; } = "";

        public string Status { get; set; } = "";

        // Hours worked today
        public double TodayHours { get; set; }

        // Total hours worked this week
        public double WeeklyHours { get; set; }

        // Most recent clock-in time
        public DateTime? LastClockIn { get; set; }

        // Most recent clock-out time (can be null if still clocked in)
        public DateTime? LastClockOut { get; set; }
    }

    public class ManagerTimeOverviewResponse
    {
        public List<ManagerTimeOverviewDto> Employees { get; set; } = [];
    }
}
