package nutrofit.domain.entity.orders;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import nutrofit.domain.entity.product.Product;
import nutrofit.domain.enums.MealPortion;

@Entity
@Table(name = "order_item")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "order_item_id")
  private Long id;

  @ManyToOne
  @JoinColumn(name = "orders_id", nullable = false)
  private Orders orders;

  @ManyToOne
  @JoinColumn(name = "product_id", nullable = false)
  private Product product;

  private Integer quantity;

  @Enumerated(EnumType.STRING)
  private MealPortion portion;

  private Integer total;

}
