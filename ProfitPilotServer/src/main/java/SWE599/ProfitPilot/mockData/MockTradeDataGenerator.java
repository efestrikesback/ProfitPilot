// src/main/java/SWE599/ProfitPilot/mockData/MockTradeDataGenerator.java

package SWE599.ProfitPilot.mockData;

import SWE599.ProfitPilot.trade.Trade;
import SWE599.ProfitPilot.trade.TradeRepository;
import SWE599.ProfitPilot.trade.TradingPairConfig;
import SWE599.ProfitPilot.user.User;
import SWE599.ProfitPilot.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
public class MockTradeDataGenerator {

    private final TradeRepository tradeRepository;
    private final UserRepository userRepository;

    // Define trading pairs with price ranges and volatility
    private final List<TradingPairConfig> tradingPairs = List.of(
            new TradingPairConfig("BTCUSDT", 90000.0, 100000.0, 1000.0),
            new TradingPairConfig("ETHUSDT", 3000.0, 4000.0, 200.0),
            new TradingPairConfig("XRPUSDT", 1.0, 2.0, 0.1),
            new TradingPairConfig("LTCUSDT", 150.0, 250.0, 10.0),
            new TradingPairConfig("BNBUSDT", 400.0, 600.0, 20.0)
    );

    private final List<String> tradeStyles = List.of("DAY_TRADING", "SWING_TRADING", "SCALPING");

    // Number of trades to generate per pair
    private final int TRADES_PER_PAIR = 100;

    // Fee rate (e.g., 0.1% fee)
    private final double FEE_RATE = 0.001;

    /**
     * Simulates a price movement based on volatility and trend.
     *
     * @param currentPrice Current price of the asset.
     * @param volatility   Maximum price change per trade.
     * @param random       Random instance.
     * @param minPrice     Minimum possible price.
     * @param maxPrice     Maximum possible price.
     * @param trend        Trend factor (positive for bullish, negative for bearish).
     * @return New price after applying change.
     */
    private double simulatePriceMovement(double currentPrice, double volatility, ThreadLocalRandom random, double minPrice, double maxPrice, double trend) {
        // Simulate a price change within ±volatility, adjusted by trend
        double changePercent = (random.nextDouble(-1.0, 1.0) * (volatility / currentPrice)) + trend;
        double newPrice = currentPrice * (1 + changePercent);

        // Ensure new price is within bounds
        return Math.max(minPrice, Math.min(newPrice, maxPrice));
    }

    /**
     * Calculates profit or loss after accounting for fees.
     *
     * @param entryPrice Entry price of the trade.
     * @param exitPrice  Exit price of the trade.
     * @param quantity   Quantity traded.
     * @param feeRate    Fee rate applied on both entry and exit.
     * @return Net profit or loss.
     */
    private double calculateProfitLoss(double entryPrice, double exitPrice, double quantity, double feeRate) {
        double grossProfit = (exitPrice - entryPrice) * quantity;
        double fees = (entryPrice * quantity + exitPrice * quantity) * feeRate;
        return grossProfit - fees;
    }

    /**
     * Assigns trade attributes based on trade style.
     *
     * @param tradeBuilder Builder for Trade entity.
     * @param tradeStyle   Style of the trade.
     * @param random       Random instance.
     * @param entryTime    Entry time of the trade.
     * @param entryPrice   Entry price of the trade.
     * @param exitPrice    Exit price of the trade.
     * @param quantity     Quantity traded.
     * @param user         User who made the trade.
     */
    private void assignTradeAttributes(Trade.TradeBuilder tradeBuilder, String tradeStyle, ThreadLocalRandom random,
                                       LocalDateTime entryTime, double entryPrice, double exitPrice, double quantity, User user) {
        switch (tradeStyle) {
            case "DAY_TRADING":
                tradeBuilder
                        .exitTime(entryTime.plusMinutes(30 + random.nextInt(91))) // 30-120 minutes
                        .quantity(quantity * 1.5); // Higher quantity
                break;
            case "SWING_TRADING":
                tradeBuilder
                        .exitTime(entryTime.plusDays(1 + random.nextInt(5))) // 1-5 days
                        .quantity(quantity);
                break;
            case "SCALPING":
                tradeBuilder
                        .exitTime(entryTime.plusMinutes(1 + random.nextInt(30))) // 1-30 minutes
                        .quantity(quantity * 2); // Smaller quantities with higher frequency
                break;
            default:
                tradeBuilder
                        .exitTime(entryTime.plusMinutes(30 + random.nextInt(91))) // 30-120 minutes
                        .quantity(quantity);
        }

        tradeBuilder
                .user(user)
                .tradeStyle(tradeStyle);
    }

    /**
     * Generates mock trades for all trading pairs and users.
     * Each trade has realistic time, price, quantity, and profit/loss values.
     */
    @Transactional
    public void generateMockTrades() {
        // Fetch all users to assign trades
        List<User> users = userRepository.findAll();

        if (users.isEmpty()) {
            throw new IllegalStateException("No users found. Please register users before generating trades.");
        }

        ThreadLocalRandom random = ThreadLocalRandom.current();
        LocalDateTime currentTime = LocalDateTime.now().minusDays(30); // Start from 30 days ago

        for (TradingPairConfig pairConfig : tradingPairs) {
            double currentPrice = getRandomPrice(pairConfig.getMinPrice(), pairConfig.getMaxPrice(), random);

            for (int i = 0; i < TRADES_PER_PAIR; i++) {
                // Simulate time increment between trades (1-3 hours)
                currentTime = currentTime.plusHours(1 + random.nextInt(3));

                // Randomly determine trend for the trade (-0.005 for bearish, 0 for neutral, 0.005 for bullish)
                double[] possibleTrends = {-0.005, 0.0, 0.005};
                double trend = possibleTrends[random.nextInt(possibleTrends.length)];

                // Simulate exit price based on volatility and trend
                double exitPrice = simulatePriceMovement(currentPrice, pairConfig.getVolatility(), random,
                        pairConfig.getMinPrice(), pairConfig.getMaxPrice(), trend);

                // Simulate quantity based on trading pair
                double quantity = generateQuantity(pairConfig.getPairName(), random);

                // Calculate profit or loss with fee
                double profitLoss = calculateProfitLoss(currentPrice, exitPrice, quantity, FEE_RATE);

                // Assign a random user
                User user = users.get(random.nextInt(users.size()));

                // Assign a random trade style
                String tradeStyle = tradeStyles.get(random.nextInt(tradeStyles.size()));

                // Create a Trade using the builder pattern
                Trade.TradeBuilder tradeBuilder = Trade.builder()
                        .asset(pairConfig.getPairName())
                        .entryTime(currentTime)
                        .entryPrice(currentPrice)
                        .exitPrice(exitPrice)
                        .profitLoss(profitLoss);

                // Assign trade attributes based on style
                assignTradeAttributes(tradeBuilder, tradeStyle, random, currentTime, currentPrice, exitPrice, quantity, user);

                // Build the Trade object
                Trade trade = tradeBuilder.build();

                // Save the trade to the repository
                tradeRepository.save(trade);

                // Update currentPrice for continuity
                currentPrice = exitPrice;
            }
        }
    }

    /**
     * Generates a random price within the specified range.
     *
     * @param minPrice Minimum price.
     * @param maxPrice Maximum price.
     * @param random   Random instance.
     * @return Randomly generated price.
     */
    private double getRandomPrice(double minPrice, double maxPrice, ThreadLocalRandom random) {
        return minPrice + random.nextDouble() * (maxPrice - minPrice);
    }

    /**
     * Generates a realistic quantity based on the trading pair.
     *
     * @param pairName Trading pair name.
     * @param random   Random instance.
     * @return Generated quantity.
     */
    private double generateQuantity(String pairName, ThreadLocalRandom random) {
        switch (pairName) {
            case "BTCUSDT":
                return 0.001 + (0.005 - 0.001) * random.nextDouble(); // 0.001 - 0.005 BTC
            case "ETHUSDT":
                return 0.01 + (0.05 - 0.01) * random.nextDouble(); // 0.01 - 0.05 ETH
            case "XRPUSDT":
                return 10 + (100 - 10) * random.nextDouble(); // 10 - 100 XRP
            case "LTCUSDT":
                return 0.1 + (0.5 - 0.1) * random.nextDouble(); // 0.1 - 0.5 LTC
            case "BNBUSDT":
                return 0.5 + (2.0 - 0.5) * random.nextDouble(); // 0.5 - 2.0 BNB
            default:
                return 1 + (10 - 1) * random.nextDouble(); // Default quantity
        }
    }
}
