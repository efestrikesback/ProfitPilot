using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProfitPilot.Data.Models
{
    public class Trade
    {
        [Key]
        public int TradeId { get; set; }

        [Required]
        public string UserId { get; set; } // Foreign key to ApplicationUser

        [ForeignKey("UserId")]
        public ApplicationUser User { get; set; }

        [Required]
        public string Asset { get; set; } // e.g., BTCUSDT, ISCTR

        [Required]
        public DateTime EntryTime { get; set; }

        [Required]
        public decimal EntryPrice { get; set; }

        public DateTime? ExitTime { get; set; }

        public decimal? ExitPrice { get; set; }

        public decimal Quantity { get; set; }

        public string TradingStyle { get; set; } // e.g., Scalping, Swing

        public decimal? ProfitLoss { get; set; }

        public string Status { get; set; } // Open or Closed

        // Additional properties can be added as needed
    }
}
