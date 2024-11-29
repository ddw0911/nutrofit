package nutrofit.dto;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import nutrofit.domain.enums.PaymentAPI;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PaymentDTO {

  private Long paymentId;
  private Long ordersId;
  private PaymentAPI api;
  private Integer total;
  private LocalDateTime payDate;
}
