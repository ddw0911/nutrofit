package nutrofit.dto;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import nutrofit.domain.entity.product.Category;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CategoryDTO {
  private Long id;
  private String category;
  @Column(name="description")
  private String categoryDescription;

  public CategoryDTO(Category category){
    this.id = category.getId();
    this.category = category.getCategory().get();
    this.categoryDescription = category.getCategoryDescription();
  }
}
