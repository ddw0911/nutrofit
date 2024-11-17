package nutrofit.exceptions;

public enum MemberException {
  BAD_CREDENTIALS("BAD_CREDENTIALS");

  private final String msg;

  MemberException(String msg) {
    this.msg=msg;
  }

  public RuntimeException get() {
    return new RuntimeException(msg);
  }
}
