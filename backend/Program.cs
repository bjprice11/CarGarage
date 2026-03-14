using backend.Endpoints;
using backend.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();

builder.Services.AddCors(options =>
{
    options.AddPolicy("StrictSecurityPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
        ;
    });
});

builder.Services.AddDbContext<AppDBContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddAuthorization();
builder.Services.AddIdentityApiEndpoints<User>().AddEntityFrameworkStores<AppDBContext>();

builder.Services.AddHttpClient();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseCors("StrictSecurityPolicy");
}
// Configure the HTTP request pipeline.

app.UseHttpsRedirection();
app.UseCors("StrictSecurityPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.MapIdentityApi<User>();
app.MapVehicleEndpoints();

app.MapGet("/api/health", () =>
{
    return Results.Ok(new {Status = "Secure and operational"});
});


app.Run();
