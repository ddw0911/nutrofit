package nutrofit.domain.entity.product;

import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import nutrofit.domain.enums.ProductImageType;

@Embeddable
@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ProductImage implements Comparable<ProductImage> {

  @Enumerated(EnumType.STRING)
  private ProductImageType type;
  private String url;

  @Override
  public int compareTo(ProductImage o) {
    return this.type.compareTo(o.type);
  }
}
