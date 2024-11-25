package SWE599.ProfitPilot.mockData;

import SWE599.ProfitPilot.user.User;
import SWE599.ProfitPilot.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.security.crypto.password.PasswordEncoder;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final MockTradeDataGenerator tradeDataGenerator;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            User user1 = User.builder()
                    .firstname("Efe")
                    .lastname("Gocmen")
                    .username("traderA")
                    .email("efe.gocmen@example.com")
                    .password(passwordEncoder.encode("password123"))
                    .build();

            User user2 = User.builder()
                    .firstname("Jane")
                    .lastname("Doe")
                    .username("traderB")
                    .email("jane.doe@example.com")
                    .password(passwordEncoder.encode("securepass"))
                    .build();

            userRepository.save(user1);
            userRepository.save(user2);

            // Generate mock trades for these users
            tradeDataGenerator.generateMockTrades();
        }
    }
}