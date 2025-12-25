namespace Backend.DTOs
{
    public class ManagerTimeOverviewDto
    {
        public Guid UserId { get; set; }
        public string FullName { get; set; } = "";
        public string Status { get; set; } = "";
        public double TodayHours { get; set; }
        public DateTime? LastClockIn { get; set; }
    }

    public class ManagerTimeOverviewResponse
    {
        public List<ManagerTimeOverviewDto> Employees { get; set; } = [];
    }
}
