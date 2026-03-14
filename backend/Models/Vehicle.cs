using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace backend.Models;

public class Vehicle
{
    public int Id { get; set; }
    
    [Required]
    public string UserId { get; set; } = string.Empty;
    
    [StringLength(17, MinimumLength = 17, ErrorMessage = "VIN  must be exactly 17 characters")]
    public string? Vin { get; set; }
    
    [Required]
    public string Make { get; set; } = string.Empty;
    [Required]
    public string Model { get; set; } = string.Empty;
    
    public int Year { get; set; }
    
    public string Displayname { get; set; } = string.Empty;
    
    [JsonIgnore]
    public User? User { get; set; }
    public ICollection<Expense> Expenses { get; set; } = new List<Expense>();
    public ICollection<Maintenance> MaintenanceRecords { get; set; } = new List<Maintenance>();
}