package SWE599.ProfitPilot.trade;

import SWE599.ProfitPilot.mockData.DataResetService;
import SWE599.ProfitPilot.user.User;
import SWE599.ProfitPilot.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.aspectj.bridge.MessageUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("/trades")
@RequiredArgsConstructor
public class TradeController {

    private final TradeService tradeService;

    private final DataResetService dataResetService;
    private final UserRepository userRepository;

    // Helper method to get the authenticated user
    private User getAuthenticatedUser(Authentication authentication) {
        String username = authentication.getName();
        return userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping("/risk-assessment")
    public ResponseEntity<Map<String, Object>> getRiskAssessment() {
        Map<String, Object> riskAssessment = tradeService.performRiskAssessment();
        return ResponseEntity.ok(riskAssessment);
    }

    @GetMapping("/trade-styles")
    public ResponseEntity<Map<String, Object>> getTradeStyles(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        Map<String, Object> tradeStyles = tradeService.analyzeTradeStyles(user);
        return ResponseEntity.ok(tradeStyles);
    }

    @GetMapping("/personal-insights")
    public ResponseEntity<Map<String, Object>> getPersonalInsights(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        Map<String, Object> insights = tradeService.generatePersonalInsights(user);
        return ResponseEntity.ok(insights);
    }

    @GetMapping("/my-trades")
    public ResponseEntity<List<Trade>> getMyTrades(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        List<Trade> trades = tradeService.getTradesByUser(user);
        return ResponseEntity.ok(trades);
    }

    @GetMapping("/best-trades")
    public ResponseEntity<List<Trade>> getBestTrades(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        List<Trade> bestTrades = tradeService.getTop3ProfitableTrades(user);
        return ResponseEntity.ok(bestTrades);
    }

    @GetMapping("/worst-trades")
    public ResponseEntity<List<Trade>> getWorstTrades(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        List<Trade> worstTrades = tradeService.getTop3LosingTrades(user);
        return ResponseEntity.ok(worstTrades);
    }

    @DeleteMapping("/reload")
    public ResponseEntity<String> reloadTrades(Authentication authentication) {
        dataResetService.resetAndRegenerateTrades();
        return ResponseEntity.ok("Trades have been cleared and new mock trades generated.");
    }
}
