using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public class UpdateShiftRequestDto
    {
        [Required]
        public DateOnly ShiftDate { get; set; }

        [Required]
        public TimeOnly StartTime { get; set; }

        [Required]
        public TimeOnly EndTime { get; set; }
    }
}
