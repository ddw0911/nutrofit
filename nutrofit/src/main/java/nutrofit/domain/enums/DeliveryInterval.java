package nutrofit.domain.enums;

public enum DeliveryInterval {
  MWF("월수금"),
  TTS("화목토");

  private final String interval;

  DeliveryInterval(String interval) {
    this.interval=interval;
  }

  public String get() {
    return interval;
  }
}

