using Backend.Models;

namespace Backend.Models
{
    public class TimeEntry
    {
        public int Id { get; set; }

        public Guid UserId { get; set; }

        public User User { get; set; } = null!;

        public DateTime ClockInAt { get; set; }

        public DateTime? ClockOutAt { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
