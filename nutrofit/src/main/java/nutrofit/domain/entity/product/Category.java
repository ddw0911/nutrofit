package nutrofit.domain.entity.product;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import nutrofit.domain.enums.MealCategory;

@Embeddable
@Getter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Category {

  @Id
  @Column(name="category_id")
  private Long id;

  private MealCategory category;
  private String description;
}
