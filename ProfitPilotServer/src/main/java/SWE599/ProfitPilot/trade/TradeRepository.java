package SWE599.ProfitPilot.trade;

import SWE599.ProfitPilot.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TradeRepository extends JpaRepository<Trade, Long> {
    List<Trade> findByUser(User user);
    List<Trade> findByUserOrderByEntryTimeDesc(User user);
}
