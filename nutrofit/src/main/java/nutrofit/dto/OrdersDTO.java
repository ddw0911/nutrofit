package nutrofit.dto;

import java.time.LocalDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import nutrofit.domain.entity.orders.Orders;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrdersDTO {

  private Long ordersId;
  private Long memberId;
  private String orderName;
  private String name;
  private String phone;
  private String address;
  private String requirement;
  private Integer total;
  private LocalDateTime orderDate;
  private List<OrderItemDTO> orderItems;

  public OrdersDTO(Orders orders) {
    this.ordersId = orders.getOrdersId();
    this.memberId = orders.getMemberBasic().getId();
    this.orderName = orders.getOrderName();
    this.name = orders.getName();
    this.phone = orders.getPhone();
    this.address = orders.getAddress();
    this.requirement = orders.getRequirement();
    this.total = orders.getTotal();
    this.orderDate = orders.getOrderDate();
  }
}
