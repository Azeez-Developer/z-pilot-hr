using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/time")]
    [Authorize]
    public class TimeController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TimeController(AppDbContext context)
        {
            _context = context;
        }

        // ============================
        // CLOCK IN
        // ============================
        [HttpPost("clock-in")]
        public async Task<IActionResult> ClockIn()
        {
            var userId = Guid.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!
            );

            var openEntry = await _context.TimeEntries
                .FirstOrDefaultAsync(t =>
                    t.UserId == userId &&
                    t.ClockOutAt == null
                );

            if (openEntry != null)
            {
                return BadRequest("User already clocked in.");
            }

            var entry = new TimeEntry
            {
                UserId = userId,
                ClockInAt = DateTime.UtcNow
            };

            _context.TimeEntries.Add(entry);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Clock-in successful",
                clockIn = entry.ClockInAt
            });
        }

        // ============================
        // CLOCK OUT  
        // ============================
        [HttpPost("clock-out")]
        public async Task<IActionResult> ClockOut()
        {
            var userId = Guid.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!
            );

            var entry = await _context.TimeEntries
                .Where(t => t.UserId == userId && t.ClockOutAt == null)
                .OrderByDescending(t => t.ClockInAt)
                .FirstOrDefaultAsync();

            if (entry == null)
            {
                return BadRequest("No active clock-in found.");
            }

            entry.ClockOutAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Clock-out successful",
                clockOut = entry.ClockOutAt
            });
        }

    // ============================
// EMPLOYEE TIME HISTORY
// ============================
[HttpGet("my-history")]
public async Task<IActionResult> GetMyTimeHistory()
{
    var userId = Guid.Parse(
        User.FindFirstValue(ClaimTypes.NameIdentifier)!
    );

    var today = DateTime.UtcNow.Date;
    var startOfWeek = today.AddDays(-(int)today.DayOfWeek);

    var entries = await _context.TimeEntries
        .Where(t => t.UserId == userId)
        .OrderByDescending(t => t.ClockInAt)
        .Take(7)
        .Select(t => new
        {
            date = t.ClockInAt.Date,
            clockIn = t.ClockInAt,
            clockOut = t.ClockOutAt,
            hours =
                t.ClockOutAt != null
                    ? Math.Round(
                        (t.ClockOutAt.Value - t.ClockInAt).TotalHours, 2)
                    : (double?)null
        })
        .ToListAsync();

    var weeklyHours = await _context.TimeEntries
        .Where(t =>
            t.UserId == userId &&
            t.ClockOutAt != null &&
            t.ClockInAt.Date >= startOfWeek
        )
        .SumAsync(t =>
            (t.ClockOutAt!.Value - t.ClockInAt).TotalHours
        );

    return Ok(new
    {
        today,
        weeklyHours = Math.Round(weeklyHours, 2),
        recent = entries
    });
}


    }
}
