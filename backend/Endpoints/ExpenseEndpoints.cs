using System.Security.Claims;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Endpoints;

public static class ExpenseEndpoints
{
    public static void MapExpenseEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/expenses").RequireAuthorization();

        group.MapPost("/", async (Expense expense, AppDBContext db, ClaimsPrincipal user) =>
        {
            var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
            
            var vehicle = await db.Vehicles
                .FirstOrDefaultAsync(v => v.Id == expense.VehicleId && v.UserId == userId);
                
            if (vehicle == null)
            {
                return Results.Unauthorized();
            }

            db.Expenses.Add(expense);
            await db.SaveChangesAsync();

            return Results.Created($"/api/expenses/{expense.Id}", expense);
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

            var expenses = await db.Expenses
                .Where(e => e.VehicleId == vehicleId)
                .OrderByDescending(e => e.Date)
                .ToListAsync();

            return Results.Ok(expenses);
        });
        group.MapPut("/{id}", async (int id, Expense inputExpense, AppDBContext db, ClaimsPrincipal user) =>
        {
            var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
            var expense = await db.Expenses
                .Include(e => e.Vehicle)
                .FirstOrDefaultAsync(e => e.Id == id && e.Vehicle!.UserId == userId);
        
            if (expense is null) return Results.NotFound();

            expense.Category = inputExpense.Category;
            expense.Amount = inputExpense.Amount;
            expense.Date = inputExpense.Date;

            await db.SaveChangesAsync();
            return Results.NoContent();
        });

        group.MapDelete("/{id}", async (int id, AppDBContext db, ClaimsPrincipal user) =>
        {
            var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
            var expense = await db.Expenses
                .Include(e => e.Vehicle)
                .FirstOrDefaultAsync(e => e.Id == id && e.Vehicle!.UserId == userId);
        
            if (expense is null) return Results.NotFound();

            db.Expenses.Remove(expense);
            await db.SaveChangesAsync();
            return Results.NoContent();
        });
    }
}