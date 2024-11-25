package SWE599.ProfitPilot.trade;

import SWE599.ProfitPilot.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TradeServiceImpl implements TradeService {

    private final TradeRepository tradeRepository;

    @Override
    public List<Trade> getTradesByUser(User user) {
        return tradeRepository.findByUser(user);
    }

    @Override
    public Map<String, Object> performRiskAssessment() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<Trade> trades = getTradesByUser(user);
        double totalTrades = trades.size();
        double profitableTrades = trades.stream().filter(t -> t.getProfitLoss() > 0).count();
        double lossTrades = totalTrades - profitableTrades;
        double profitRate = (profitableTrades / totalTrades) * 100;
        double lossRate = (lossTrades / totalTrades) * 100;

        Map<String, Object> riskAssessment = new HashMap<>();
        riskAssessment.put("totalTrades", totalTrades);
        riskAssessment.put("profitableTrades", profitableTrades);
        riskAssessment.put("lossTrades", lossTrades);
        riskAssessment.put("profitRate", profitRate);
        riskAssessment.put("lossRate", lossRate);

        return riskAssessment;
    }

    @Override
    public Map<String, Object> analyzeTradeStyles(User user) {
        List<Trade> trades = getTradesByUser(user);
        Map<String, Long> styleCount = trades.stream()
                .collect(Collectors.groupingBy(Trade::getTradeStyle, Collectors.counting()));
        return new HashMap<>(styleCount);
    }

    @Override
    public Map<String, Object> generatePersonalInsights(User user) {
        Map<String, Object> insights = new HashMap<>();

        // Example Insight: Compare scalp vs swing trade success rates
        List<Trade> trades = getTradesByUser(user);

        Map<String, List<Trade>> tradesByStyle = trades.stream()
                .collect(Collectors.groupingBy(Trade::getTradeStyle));

        for(String style : tradesByStyle.keySet()) {
            List<Trade> styleTrades = tradesByStyle.get(style);
            double total = styleTrades.size();
            double profitable = styleTrades.stream().filter(t -> t.getProfitLoss() > 0).count();
            double successRate = (profitable / total) * 100;
            insights.put(style + "SuccessRate", successRate);
        }

        return insights;
    }
}
