using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace backend.Models;

public class Expense
{
    public int Id { get; set; }
    
    [Required]
    public int VehicleId{ get; set; }
    [Required]
    public string Category { get; set; } = string.Empty;
    [Required]
    public decimal Amount { get; set; }
    
    public DateTime Date { get; set; } = DateTime.UtcNow;
    
    [JsonIgnore]
    public Vehicle? Vehicle { get; set; }
}