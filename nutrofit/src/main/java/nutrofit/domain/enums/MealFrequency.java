package nutrofit.domain.enums;

public enum MealFrequency {
  ONCE("1회"),
  TWICE("2회"),
  THREE_TIMES("3회");

  private final String frequency;

  MealFrequency(String frequency) {
    this.frequency = frequency;
  }

  public String get() {
    return frequency;
  }

  public static MealFrequency getEnum(String frequency) {
    for (MealFrequency frequencyEnum : MealFrequency.values()) {
      if (frequencyEnum.frequency.equals(frequency)) {
        return frequencyEnum;
      }
    }
    return null;
  }
}
