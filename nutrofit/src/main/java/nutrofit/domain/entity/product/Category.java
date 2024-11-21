package nutrofit.domain.entity.product;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import nutrofit.domain.enums.MealCategory;

@Entity
@Table(name="category")
@Data
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Category {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name="category_id")
  private Long id;

  @Enumerated(EnumType.STRING)
  private MealCategory category;

  @Column(name="description")
  private String categoryDescription;
}
