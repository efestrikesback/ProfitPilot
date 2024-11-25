package SWE599.ProfitPilot.trade;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TradingPairConfig {
    private String pairName;
    private double minPrice;
    private double maxPrice;
    private double volatility;
}