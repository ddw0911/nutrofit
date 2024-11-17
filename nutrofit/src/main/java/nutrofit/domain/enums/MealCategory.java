package nutrofit.domain.enums;

public enum MealCategory {
  HEALTHY("건강"),
  HIGH_PROTEIN("고단백"),
  LOW_CARB("저탄수화물"),
  LOW_SALT("저염식"),
  VEGAN("채식"),
  DIET("다이어트"),
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
}
