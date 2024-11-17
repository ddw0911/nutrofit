package nutrofit.domain.enums;

public enum PaymentAPI {
  NAVER("네이버"),
  KAKAO("카카오"),
  TOSS("토스");

  private final String api;

  PaymentAPI(String api) {
    this.api = api;
  }

  public String get() {
    return api;
  }
}
