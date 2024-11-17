package nutrofit.domain.enums;

public enum UsagePeriod {
  UNTIL_UNSUBSCRIBED("해지 시까지"),
  TWO_WEEKS("2주"),
  ONE_MONTH("1개월");

  private final String period;

  UsagePeriod(String period) {
    this.period=period;
  }

  public String get() {
    return period;
  }
}
