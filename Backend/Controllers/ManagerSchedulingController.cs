using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Backend.Data;
using Backend.DTOs;
using Backend.Models;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/manager/scheduling")]
    [Authorize(Roles = "Manager")]
    public class ManagerSchedulingController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ManagerSchedulingController(AppDbContext context)
        {
            _context = context;
        }

        // ================================
        // GET: Manager weekly schedule
        // ================================
        [HttpGet("week")]
        public async Task<ActionResult<ManagerScheduleResponseDto>> GetWeekSchedule(
            [FromQuery] DateOnly weekStart
        )
        {
            var managerId = Guid.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!
            );

            var weekEnd = weekStart.AddDays(6);

            var shifts = await _context.Shifts
                .Include(s => s.Employee)
                .Where(s =>
                    s.ManagerId == managerId &&
                    s.ShiftDate >= weekStart &&
                    s.ShiftDate <= weekEnd
                )
                .ToListAsync();

            var employees = shifts
                .Where(s => s.Employee != null)
                .GroupBy(s => new
                {
                    s.EmployeeId,
                    s.Employee!.FirstName,
                    s.Employee!.LastName
                })
                .Select(group => new ManagerScheduleEmployeeDto
                {
                    EmployeeId = group.Key.EmployeeId,
                    FullName = $"{group.Key.FirstName} {group.Key.LastName}",
                    Shifts = group.Select(s => new ManagerScheduleShiftDto
                    {
                        ShiftId = s.Id,
                        EmployeeId = s.EmployeeId,
                        ShiftDate = s.ShiftDate,
                        StartTime = s.StartTime,
                        EndTime = s.EndTime
                    }).ToList()
                })
                .ToList();

            return Ok(new ManagerScheduleResponseDto
            {
                WeekStart = weekStart,
                WeekEnd = weekEnd,
                Employees = employees
            });
        }

        // ================================
        // POST: Create shift
        // ================================
        [HttpPost("shift")]
        public async Task<IActionResult> CreateShift(
            [FromBody] CreateShiftRequestDto request
        )
        {
            var managerId = Guid.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!
            );

            if (request.EndTime <= request.StartTime)
            {
                return BadRequest("End time must be after start time.");
            }

            // Ensure employee belongs to manager
            var employee = await _context.Users
                .Where(u =>
                    u.Id == request.EmployeeId &&
                    u.ManagerId == managerId &&
                    u.Role == "Employee"
                )
                .FirstOrDefaultAsync();

            if (employee == null)
            {
                return Forbid();
            }

            var shift = new Shift
            {
                Id = Guid.NewGuid(),
                EmployeeId = request.EmployeeId,
                ManagerId = managerId,
                ShiftDate = request.ShiftDate,
                StartTime = request.StartTime,
                EndTime = request.EndTime,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Shifts.Add(shift);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                shiftId = shift.Id
            });
        }
    }
}
