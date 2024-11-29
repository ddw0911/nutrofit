package nutrofit.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import nutrofit.domain.entity.orders.OrderItem;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemDTO {

  private Long orderItemId;
  private Long ordersId;
  private Long productId;
  private Integer quantity;
  private String portion;
  private Integer total;

  public OrderItemDTO(OrderItem item) {
    this.orderItemId = item.getId();
    this.ordersId = item.getOrders().getOrdersId();
    this.productId = item.getProduct().getId();
    this.quantity = item.getQuantity();
    this.portion = item.getPortion().get();
    this.total = item.getTotal();
  }
}
