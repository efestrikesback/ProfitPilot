package SWE599.ProfitPilot.trade;

import SWE599.ProfitPilot.user.User;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "trades")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Trade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String asset; // e.g., BTCUSDT, ISCTR

    private Double entryPrice;

    private Double exitPrice;

    private Double quantity;

    private Double profitLoss; // Calculated as (exitPrice - entryPrice) * quantity

    private LocalDateTime entryTime;

    private LocalDateTime exitTime;

    private String tradeStyle; // e.g., scalp, swing

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}