package nutrofit.domain.enums;

public enum SNS {
  NAVER("네이버"),
  KAKAO("카카오"),
  GOOGLE("구글");

  private final String sns;

  SNS(String sns) {
    this.sns = sns;
  }

  public String get() {
    return sns;
  }
}
