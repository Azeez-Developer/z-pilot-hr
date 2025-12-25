using Backend.Data;
using Backend.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/manager/time")]
    [Authorize(Roles = "Manager")]
    public class ManagerTimeController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ManagerTimeController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("overview")]
        public async Task<ActionResult<ManagerTimeOverviewResponse>> GetTeamOverview()
        {
            var today = DateTime.UtcNow.Date;

            // Start of week (Monday)
            var startOfWeek = today.AddDays(-(int)today.DayOfWeek + 1);
            if (today.DayOfWeek == DayOfWeek.Sunday)
            {
                startOfWeek = today.AddDays(-6);
            }

            var users = await _context.Users
                .Where(u => u.IsActive && u.Role == "Employee")
                .ToListAsync();

            var response = new ManagerTimeOverviewResponse();

            foreach (var user in users)
            {
                var timeEntries = await _context.TimeEntries
                    .Where(t => t.UserId == user.Id && t.ClockInAt >= startOfWeek)
                    .OrderByDescending(t => t.ClockInAt)
                    .ToListAsync();

                if (!timeEntries.Any())
                {
                    response.Employees.Add(new ManagerTimeOverviewDto
                    {
                        UserId = user.Id,
                        FullName = $"{user.FirstName} {user.LastName}",
                        Status = "Clocked Out",
                        TodayHours = 0,
                        WeeklyHours = 0,
                        LastClockIn = null,
                        LastClockOut = null
                    });
                    continue;
                }

                double todayHours = 0;
                double weeklyHours = 0;

                foreach (var entry in timeEntries)
                {
                    var end = entry.ClockOutAt ?? DateTime.UtcNow;
                    var hours = (end - entry.ClockInAt).TotalHours;

                    weeklyHours += hours;

                    if (entry.ClockInAt.Date == today)
                    {
                        todayHours += hours;
                    }
                }

                var latest = timeEntries.First();

                response.Employees.Add(new ManagerTimeOverviewDto
                {
                    UserId = user.Id,
                    FullName = $"{user.FirstName} {user.LastName}",
                    Status = latest.ClockOutAt == null ? "Clocked In" : "Clocked Out",
                    TodayHours = Math.Round(todayHours, 2),
                    WeeklyHours = Math.Round(weeklyHours, 2),
                    LastClockIn = latest.ClockInAt,
                    LastClockOut = latest.ClockOutAt
                });
            }

            return Ok(response);
        }
    }
}
