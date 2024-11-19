package nutrofit.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import nutrofit.domain.enums.MealCategory;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CategoryDTO {
  private Long id;
  private MealCategory category;
  private String description;
}
