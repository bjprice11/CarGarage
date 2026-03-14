using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace backend.Models;

public class Maintenance
{
    public int Id { get; set; }

    [Required] public int VehicleId { get; set; }
    [Required] public string ServiceType { get; set; } = string.Empty;
    public int MilageAtService { get; set; }
    public DateTime Date { get; set; } = DateTime.UtcNow;
    public string? Notes { get; set; }

    [JsonIgnore ]
    public Vehicle? Vehicle { get; set; }

}