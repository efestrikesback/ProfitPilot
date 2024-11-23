using Microsoft.AspNetCore.Identity;
using System;
using System.ComponentModel.DataAnnotations;

namespace ProfitPilot.Models
{
    public class User : IdentityUser
    {

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    }
}
