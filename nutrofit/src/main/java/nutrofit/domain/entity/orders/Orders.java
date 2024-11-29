package nutrofit.domain.entity.orders;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import nutrofit.domain.entity.member.MemberBasic;
import nutrofit.dto.OrdersDTO;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Table(name="orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(value={AuditingEntityListener.class})
@Builder
public class Orders {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name="orders_id")
  private Long ordersId;

  @ManyToOne
  @JoinColumn(name="member_id", nullable = false)
  private MemberBasic memberBasic;
  @Column(name="order_name")
  private String orderName;
  private String name;
  private String phone;
  private String address;
  private String requirement;
  @Column(name="total_amount")
  private Integer total;
  @CreatedDate
  @Column(name = "order_date")
  private LocalDateTime orderDate;

  public Orders(OrdersDTO order, MemberBasic member) {
    this.memberBasic = member;
    this.orderName = order.getOrderName();
    this.name = order.getName();
    this.phone = order.getPhone();
    this.address = order.getAddress();
    this.requirement = order.getRequirement();
    this.total = order.getTotal();
  }
}
