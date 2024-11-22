package nutrofit.dto;

import java.text.DecimalFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import nutrofit.domain.entity.product.Nutrition;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NutritionDTO {
  private Integer calories;
  private Integer carbo;
  private Integer protein;
  private String saturatedFat;
  private String transFat;
  private Integer cholesterol;
  private Integer sodium;

  private static final DecimalFormat DECIMAL_FORMAT = new DecimalFormat("0.0");

  public NutritionDTO(Nutrition nutrition) {
    this.calories = nutrition.getCalories();
    this.carbo = nutrition.getCarbo();
    this.protein = nutrition.getProtein();
    this.saturatedFat = DECIMAL_FORMAT.format(nutrition.getSaturatedFat());
    this.transFat = DECIMAL_FORMAT.format(nutrition.getTransFat());
    this.cholesterol = nutrition.getCholesterol();
    this.sodium = nutrition.getSodium();
  }
}
