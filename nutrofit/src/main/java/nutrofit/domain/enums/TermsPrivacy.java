package nutrofit.domain.enums;

public enum TermsPrivacy {
  TERMS("이용약관"),
  PRIVACY("개인정보 처리방침");

  private final String type;

  TermsPrivacy(String type) {
    this.type = type;
  }

  public String get() {
    return type;
  }
}
