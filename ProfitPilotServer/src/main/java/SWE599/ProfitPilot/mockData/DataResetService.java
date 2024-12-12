package SWE599.ProfitPilot.mockData;

import SWE599.ProfitPilot.trade.TradeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DataResetService {

    private final TradeRepository tradeRepository;
    private final MockTradeDataGenerator tradeDataGenerator;

    @Transactional
    public void resetAndRegenerateTrades() {
        tradeRepository.deleteAll();

        tradeDataGenerator.generateMockTrades();
    }
}
