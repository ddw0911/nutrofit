package nutrofit.exceptions;

public enum ExceptionMessage {
  BAD_CREDENTIALS("BAD_CREDENTIALS"),
  NOT_FOUNDED("NOT_FOUNDED");

  private final String msg;

  ExceptionMessage(String msg) {
    this.msg=msg;
  }

  public RuntimeException get() {
    return new RuntimeException(msg);
  }
}
