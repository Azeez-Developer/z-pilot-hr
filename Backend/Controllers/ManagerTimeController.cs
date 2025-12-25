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

            var users = await _context.Users
                .Where(u => u.IsActive && u.Role == "Employee")
                .ToListAsync();

            var response = new ManagerTimeOverviewResponse();

            foreach (var user in users)
            {
                var todayEntries = await _context.TimeEntries
                    .Where(t => t.UserId == user.Id && t.ClockInAt.Date == today)
                    .OrderByDescending(t => t.ClockInAt)
                    .ToListAsync();

                if (!todayEntries.Any())
                {
                    response.Employees.Add(new ManagerTimeOverviewDto
                    {
                        UserId = user.Id,
                        FullName = $"{user.FirstName} {user.LastName}",
                        Status = "Clocked Out",
                        TodayHours = 0,
                        LastClockIn = null
                    });
                    continue;
                }

                var latest = todayEntries.First();

                double hours = 0;

                foreach (var entry in todayEntries)
                {
                    var end = entry.ClockOutAt ?? DateTime.UtcNow;
                    hours += (end - entry.ClockInAt).TotalHours;
                }

                response.Employees.Add(new ManagerTimeOverviewDto
                {
                    UserId = user.Id,
                    FullName = $"{user.FirstName} {user.LastName}",
                    Status = latest.ClockOutAt == null ? "Clocked In" : "Clocked Out",
                    TodayHours = Math.Round(hours, 2),
                    LastClockIn = latest.ClockInAt
                });
            }

            return Ok(response);
        }
    }
}
