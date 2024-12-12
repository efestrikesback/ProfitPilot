package SWE599.ProfitPilot.trade;

import SWE599.ProfitPilot.user.User;

import java.util.List;
import java.util.Map;

public interface TradeService {
    List<Trade> getTradesByUser(User user);
    Map<String, Object> performRiskAssessment();
    Map<String, Object> analyzeTradeStyles(User user);
    Map<String, Object> generatePersonalInsights(User user);
    List<Trade> getTop3ProfitableTrades(User user);
    List<Trade> getTop3LosingTrades(User user);
}