package SWE599.ProfitPilot.mockData;

import SWE599.ProfitPilot.trade.Trade;
import SWE599.ProfitPilot.trade.TradeRepository;
import SWE599.ProfitPilot.user.User;
import SWE599.ProfitPilot.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final TradeRepository tradeRepository;

    private final BCryptPasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Create a user if not exists
        User user = userRepository.findByUsername("traderA").orElseGet(() -> {
            User newUser = User.builder()
                    .firstname("Efe")
                    .lastname("Gocmen")
                    .username("traderA")
                    .email("efe.gocmen@example.com")
                    .password(passwordEncoder.encode("password123"))
                    .build();
            return userRepository.save(newUser);
        });

        // Check if trades exist
        if(tradeRepository.findByUser(user).isEmpty()) {
            // Create mock trades
            Trade trade1 = Trade.builder()
                    .asset("BTCUSDT")
                    .entryPrice(30000.0)
                    .exitPrice(30500.0)
                    .quantity(0.5)
                    .profitLoss((30500.0 - 30000.0) * 0.5)
                    .entryTime(LocalDateTime.now().minusDays(2))
                    .exitTime(LocalDateTime.now().minusDays(2).plusHours(1))
                    .tradeStyle("scalp")
                    .user(user)
                    .build();

            Trade trade2 = Trade.builder()
                    .asset("ISCTR")
                    .entryPrice(1500.0)
                    .exitPrice(1520.0)
                    .quantity(10.0)
                    .profitLoss((1520.0 - 1500.0) * 10.0)
                    .entryTime(LocalDateTime.now().minusDays(1))
                    .exitTime(LocalDateTime.now().minusDays(1).plusHours(3))
                    .tradeStyle("swing")
                    .user(user)
                    .build();

            tradeRepository.save(trade1);
            tradeRepository.save(trade2);
        }
    }
}
