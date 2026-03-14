using System.Security.Claims;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Endpoints;

public static class MaintenanceEndpoints
{
    public static void MapMaintenanceEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/maintenance").RequireAuthorization();

        group.MapPost("/", async (Maintenance record, AppDBContext db, ClaimsPrincipal user) =>
        {
            var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
            
            var vehicle = await db.Vehicles
                .FirstOrDefaultAsync(v => v.Id == record.VehicleId && v.UserId == userId);
                
            if (vehicle == null)
            {
                return Results.Unauthorized();
            }

            db.MaintenanceRecords.Add(record);
            await db.SaveChangesAsync();

            return Results.Created($"/api/maintenance/{record.Id}", record);
        });

        group.MapGet("/vehicle/{vehicleId}", async (int vehicleId, AppDBContext db, ClaimsPrincipal user) =>
        {
            var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
            
            var vehicle = await db.Vehicles
                .FirstOrDefaultAsync(v => v.Id == vehicleId && v.UserId == userId);
                
            if (vehicle == null)
            {
                return Results.Unauthorized();
            }

            var records = await db.MaintenanceRecords
                .Where(m => m.VehicleId == vehicleId)
                .OrderByDescending(m => m.Date)
                .ToListAsync();

            return Results.Ok(records);
        });
        group.MapPut("/{id}", async (int id, Maintenance inputRecord, AppDBContext db, ClaimsPrincipal user) =>
        {
            var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
            var record = await db.MaintenanceRecords
                .Include(m => m.Vehicle)
                .FirstOrDefaultAsync(m => m.Id == id && m.Vehicle!.UserId == userId);
        
            if (record is null) return Results.NotFound();

            record.ServiceType = inputRecord.ServiceType;
            record.MilageAtService = inputRecord.MilageAtService;
            record.Date = inputRecord.Date;
            record.Notes = inputRecord.Notes;

            await db.SaveChangesAsync();
            return Results.NoContent();
        });

        group.MapDelete("/{id}", async (int id, AppDBContext db, ClaimsPrincipal user) =>
        {
            var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
            var record = await db.MaintenanceRecords
                .Include(m => m.Vehicle)
                .FirstOrDefaultAsync(m => m.Id == id && m.Vehicle!.UserId == userId);
        
            if (record is null) return Results.NotFound();

            db.MaintenanceRecords.Remove(record);
            await db.SaveChangesAsync();
            return Results.NoContent();
        });
    }
}