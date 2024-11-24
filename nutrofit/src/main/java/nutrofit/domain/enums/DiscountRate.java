package nutrofit.domain.enums;

public enum DiscountRate {
  THREE_PER("3% 할인"),
  FIVE_PER("5% 할인"),
  SEVEN_PER("7% 할인"),
  NONE("할인 미적용");

  private final String rate;

  DiscountRate(String rate) {
    this.rate = rate;
  }

  public String get() {
    return rate;
  }

  public static DiscountRate getEnum(String discount) {
    // enum 이름으로 먼저 시도
    try {
      return DiscountRate.valueOf(discount);
    } catch (IllegalArgumentException e) {
      // 실패하면 rate 값으로 시도
      for (DiscountRate discountEnum : DiscountRate.values()) {
        if (discountEnum.rate.equals(discount)) {
          return discountEnum;
        }
      }
    }
    return NONE; // 기본값 반환 (null 대신)
  }
}
