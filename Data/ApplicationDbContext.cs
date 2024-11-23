using Microsoft.EntityFrameworkCore;
using ProfitPilot.Models;

namespace ProfitPilot.Data
{
    public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
    {
        public DbSet<User>? Users { get; set; }

    }
}
