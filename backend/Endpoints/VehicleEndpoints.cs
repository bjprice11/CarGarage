using System.Security.Claims;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Text.Json.Serialization;

namespace backend.Endpoints;

public static class VehicleEndpoints
{
    public static void MapVehicleEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/vehicles").RequireAuthorization();

        group.MapPost("/", async (Vehicle vehicle, AppDBContext db, ClaimsPrincipal user) =>
        {
            var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Results.Unauthorized();
            }

            vehicle.UserId = userId;

            db.Vehicles.Add(vehicle);
            await db.SaveChangesAsync();

            return Results.Created($"/api/vehicles/{vehicle.Id}", vehicle);
        });

        group.MapGet("/", async (AppDBContext db, ClaimsPrincipal user) =>
        {
            var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);

            var vehicle = await db.Vehicles
                .Where(v => v.UserId == userId)
                .ToListAsync();

            return Results.Ok(vehicle);
        });

        group.MapGet("/decode/{vin}", async (string vin, IHttpClientFactory HttpClientFactory) =>
        {
            if (string.IsNullOrWhiteSpace(vin) || vin.Length != 17)
            {
                return Results.BadRequest("Invalid VIN");
            }

            var client = HttpClientFactory.CreateClient();
            var url = $"https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/{vin}?format=json";

            var nhtsaData = await client.GetFromJsonAsync<NhtsaResponse>(url);
            var vehicleInfo = nhtsaData?.DecodedResults?.FirstOrDefault();

            if (vehicleInfo == null || string.IsNullOrEmpty(vehicleInfo.Make))
            {
                return Results.NotFound("Vehicle could not be found. Please check your VIN again.");
            }

            return Results.Ok(new
            {
                make = vehicleInfo.Make,
                model = vehicleInfo.Model,
                year = vehicleInfo.ModelYear
            });
        });
    }
    
}

public class NhtsaResponse
{
    [JsonPropertyName("Results")]
    public List<NhtsaResult>? DecodedResults { get; set; } 
}

public class NhtsaResult
{
    public string? Make { get; set; }
    public string? Model { get; set; }
    public string? ModelYear { get; set; }
}