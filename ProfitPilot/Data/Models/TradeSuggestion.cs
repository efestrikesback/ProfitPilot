using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProfitPilot.Data.Models
{
    public class TradeSuggestion
    {
        [Key]
        public int SuggestionId { get; set; }

        [Required]
        public string UserId { get; set; } // Foreign key to ApplicationUser

        [ForeignKey("UserId")]
        public ApplicationUser User { get; set; }

        [Required]
        public string Asset { get; set; }

        [Required]
        public string SuggestionType { get; set; } // e.g., Buy, Sell

        [Required]
        public decimal SuggestedPrice { get; set; }

        public DateTime GeneratedAt { get; set; }

        public bool IsPremium { get; set; }

        // Additional properties can be added as needed
    }
}
