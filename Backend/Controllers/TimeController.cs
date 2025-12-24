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
        // CLOCK OUT  ✅ ADD THIS
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
    }
}
