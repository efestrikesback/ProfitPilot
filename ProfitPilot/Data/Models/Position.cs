using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProfitPilot.Data.Models
{
    public class Position
    {
        [Key]
        public int PositionId { get; set; }

        [Required]
        public string UserId { get; set; } // Foreign key to ApplicationUser

        [ForeignKey("UserId")]
        public ApplicationUser User { get; set; }

        [Required]
        public string Asset { get; set; }

        [Required]
        public DateTime EntryTime { get; set; }

        [Required]
        public decimal EntryPrice { get; set; }

        public decimal Quantity { get; set; }

        public string TradingStyle { get; set; }

        // Additional properties can be added as needed
    }
}
