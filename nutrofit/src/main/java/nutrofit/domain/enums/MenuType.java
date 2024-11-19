package nutrofit.domain.enums;

public enum MenuType {
  SPECIAL("특별 메뉴"),
  SIGNATURE("시그니쳐 메뉴");

  private final String type;

  MenuType(String type) {
    this.type = type;
  }

  public String get() {
    return type;
  }
}
