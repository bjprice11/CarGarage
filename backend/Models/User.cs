using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;


namespace backend.Models;

public class User :  IdentityUser
{
    public ICollection<Vehicle> Vehicles { get; set; } = new List<Vehicle>();
}