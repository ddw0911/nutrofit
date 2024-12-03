package nutrofit.dto;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import nutrofit.domain.entity.product.CartItem;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CartItemDTO {
  private Long id;
  private Long memberId; // 회원 ID
  private Long productId; // 제품 ID
  private Integer quantity; // 수량
  private String portion; // 제공량
  private Integer total; // 총 가격
  private LocalDateTime regDate;

  public CartItemDTO(CartItem cartItem) {
    this.id = cartItem.getId();
    this.memberId= cartItem.getMember().getId();
    this.productId = cartItem.getProduct().getId();
    this.quantity = cartItem.getQuantity();
    this.portion = cartItem.getPortion().get();
    this.total = cartItem.getTotal();
    this.regDate = cartItem.getRegDate();
  }
}
