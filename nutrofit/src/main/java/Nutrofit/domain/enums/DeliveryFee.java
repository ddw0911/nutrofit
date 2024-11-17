package Nutrofit.domain.enums;

public enum DeliveryFee {
  FREE("무료"),
  FEE("2,500원");

  private final String fee;

  DeliveryFee(String fee) {
    this.fee=fee;
  }

  public String get() {
    return fee;
  }
}
