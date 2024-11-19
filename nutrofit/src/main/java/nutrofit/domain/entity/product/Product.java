package nutrofit.domain.entity.product;

import jakarta.persistence.CascadeType;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import java.util.SortedSet;
import java.util.TreeSet;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import nutrofit.domain.enums.DiscountRate;
import nutrofit.domain.enums.MenuType;
import nutrofit.domain.enums.ProductImageType;
import nutrofit.domain.enums.ProductPopularity;

@Entity
@Table(name = "product")
@Data
@ToString(exclude = {"nutrition"})
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Product {

  @Id
  @Column(name = "product_id")
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Embedded
  private Category category;
  private MenuType type;

  @Enumerated(EnumType.STRING)
  private ProductPopularity popularity;
  private String name;
  private String description;

  @Min(0)
  private Integer price;
  private String component;
  private String recipe;

  @Enumerated(EnumType.STRING)
  private DiscountRate discount;

  @OneToOne(mappedBy = "product", cascade = CascadeType.ALL)
  private Nutrition nutrition;

  @ElementCollection(fetch= FetchType.LAZY)
  @CollectionTable(name="product_image", joinColumns = @JoinColumn(name="product_id"))
  @Builder.Default
  private SortedSet<ProductImage> images = new TreeSet<>();

  public void addImage(ProductImageType type, String url) {
    ProductImage productImage = ProductImage.builder()
        .type(type)
        .url(url)
        .build();
    images.add(productImage);
  }
}
