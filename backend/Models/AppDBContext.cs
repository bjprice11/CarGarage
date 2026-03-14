using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace backend.Models;

public class AppDBContext : IdentityDbContext<User>
{
    public AppDBContext(DbContextOptions<AppDBContext> options) : base(options){}
    public DbSet<Vehicle> Vehicles => Set<Vehicle>();
    public DbSet<Expense> Expenses => Set<Expense>();
    public DbSet<Maintenance> MaintenanceRecords => Set<Maintenance>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
    }
}