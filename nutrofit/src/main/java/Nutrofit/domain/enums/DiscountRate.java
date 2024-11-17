package Nutrofit.domain.enums;

public enum DiscountRate {
  THREE_PERCENT("3%"),
  FIVE_PERCENT("5%"),
  SEVEN_PERCENT("7%");

  private final String percent;

  DiscountRate(String percent) {
    this.percent = percent;
  }

  public String get() {
    return percent;
  }
}
