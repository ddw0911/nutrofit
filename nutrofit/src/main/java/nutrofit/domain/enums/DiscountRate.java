package nutrofit.domain.enums;

public enum DiscountRate {
  THREE_PER("3%"),
  FIVE_PER("5%"),
  SEVEN_PER("7%");

  private final String percent;

  DiscountRate(String percent) {
    this.percent = percent;
  }

  public String get() {
    return percent;
  }
}
