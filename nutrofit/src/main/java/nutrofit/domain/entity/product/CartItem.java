package nutrofit.domain.entity.product;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import nutrofit.domain.entity.member.MemberBasic;
import nutrofit.domain.enums.MealPortion;
import nutrofit.dto.CartItemDTO;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "cart_item")
@EntityListeners(value={AuditingEntityListener.class})
@Builder
public class CartItem {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name="cart_item_id")
  private Long id; // 장바구니 항목 ID

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "member_id", nullable = false)
  private MemberBasic member; // 소유 회원 정보

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "product_id", nullable = false)
  private Product product; // 장바구니에 담긴 제품 정보

  @Column(nullable = false)
  private int quantity; // 제품 수량

  @Column(nullable = false)
  @Enumerated(EnumType.STRING)
  private MealPortion portion; // 1회제공량 ("ONE", "TWO", "FOUR")

  @Min(0)
  private int total; // 총 가격

  @CreatedDate
  @Column(name="reg_date", updatable = false)
  private LocalDateTime regDate; // 등록 시간

  public CartItem(CartItemDTO dto, MemberBasic member, Product product) {
    this.member = member;
    this.product = product;
    this.quantity = dto.getQuantity();
    this.portion = MealPortion.getEnum(dto.getPortion());
    this.total = dto.getTotal();
    this.regDate = LocalDateTime.now();
  }

  public String addSuccess() {
    return product.getName() + " 제품, " + portion + " "+ quantity + " 개 장바구니 등록 완료";
  }

  public String updateSuccess() {
    return "장바구니 항목 업데이트 : " + product.getName();
  }
}
