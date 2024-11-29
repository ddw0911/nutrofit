package nutrofit.domain.enums;

public enum MealCategory {
  BALANCE("밸런스"),
  HIGH_PROTEIN("고단백"),
  LOW_CARB("저당"),
  LOW_SALT("저염식"),
  DIET("다이어트"),
  SENIOR("시니어"),
  DIABETES("당뇨"),
  HIGH_BLOOD_PRESSURE("고혈압"),
  CANCER("항암치료");

  private final String category;

  MealCategory(String category) {
    this.category = category;
  }

  public String get() {
    return category;
  }

  public static MealCategory getEnum(String category) {
    for (MealCategory categoryEnum : MealCategory.values()) {
      if (categoryEnum.category.equals(category)) {
        return categoryEnum;
      }
    }
    return null;
  }
}
