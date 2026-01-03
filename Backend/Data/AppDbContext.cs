using Microsoft.EntityFrameworkCore;
using Backend.Models;

namespace Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users => Set<User>();
        public DbSet<TimeEntry> TimeEntries => Set<TimeEntry>();

        public DbSet<Shift> Shifts { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<TimeEntry>()
                .HasOne(te => te.User)
                .WithMany()
                .HasForeignKey(te => te.UserId);

            modelBuilder.Entity<Shift>()
                .HasOne(s => s.Employee)
                .WithMany()
                .HasForeignKey(s => s.EmployeeId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Shift>()
                .HasOne(s => s.Manager)
                .WithMany()
                .HasForeignKey(s => s.ManagerId)
                .OnDelete(DeleteBehavior.Restrict);
    
        }
    }
}
