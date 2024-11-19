package nutrofit.dto;

import jakarta.validation.constraints.Min;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import nutrofit.domain.entity.product.Product;
import nutrofit.domain.entity.product.ProductImage;
import nutrofit.domain.enums.DiscountRate;
import nutrofit.domain.enums.MenuType;
import nutrofit.domain.enums.ProductPopularity;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductDTO {
  private Long id;
  private String category;
  private MenuType type;
  private ProductPopularity popularity;
  private String name;
  private String description;
  @Min(0)
  private int price;
  private String component;
  private String recipe;
  private DiscountRate discount;
  private List<String> images;

  public ProductDTO(Product product) {
    this.id = product.getId();
    this.category = product.getCategory().getCategory().get();
    this.popularity = product.getPopularity();
    this.name = product.getName();
    this.description = product.getDescription();
    this.price = product.getPrice();
    this.component = product.getComponent();
    this.recipe = product.getRecipe();
    this.discount = product.getDiscount();
    this.images = product.getImages().stream()
        .map(ProductImage::getUrl)
        .collect(Collectors.toList());
  }
}
