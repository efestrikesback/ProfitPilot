using Microsoft.AspNetCore.Identity;
using ProfitPilot.Data.Models;

namespace ProfitPilot.Data
{
    // Add profile data for application users by adding properties to the ApplicationUser class
    public class ApplicationUser : IdentityUser
    {
        public ICollection<Trade> Trades { get; set; } = new List<Trade>();
        public ICollection<Position> Positions { get; set; } = new List<Position>();
        public ICollection<TradeSuggestion> TradeSuggestions { get; set; } = new List<TradeSuggestion>();
    }

}
