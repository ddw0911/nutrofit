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
}
