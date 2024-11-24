package nutrofit.domain.enums;

public enum MealPortion {
  ONE("1인분"),
  TWO("2인분"),
  FOUR("4인분");

  private final String portion;

  MealPortion(String portion) {
    this.portion = portion;
  }

  public String get() {
    return portion;
  }

  public static MealPortion getEnum(String portion) {
    try {
      return MealPortion.valueOf(portion);
    } catch (IllegalArgumentException e) {
      // enum 이름으로 매핑 실패시 portion 값으로 시도
      for (MealPortion portionEnum : MealPortion.values()) {
        if (portionEnum.portion.equals(portion)) {
          return portionEnum;
        }
      }
    }
    return ONE;
  }
}
