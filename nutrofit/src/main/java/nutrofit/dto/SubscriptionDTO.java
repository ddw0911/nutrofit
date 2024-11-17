package nutrofit.dto;

import nutrofit.domain.entity.member.Subscription;
import nutrofit.domain.enums.DeliveryInterval;
import nutrofit.domain.enums.MealCategory;
import nutrofit.domain.enums.MealFrequency;
import nutrofit.domain.enums.UsagePeriod;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SubscriptionDTO {

  private MealCategory category;

  private UsagePeriod period;

  private MealFrequency mealFrequency;

  private Integer portion;

  private DeliveryInterval deliveryInterval;

  private Integer fee;

  private LocalDate regDate;

  public SubscriptionDTO(Subscription subscriptionEntity) {
    this.category = subscriptionEntity.getCategory();
    this.period = subscriptionEntity.getPeriod();
    this.mealFrequency = subscriptionEntity.getMealFrequency();
    this.portion = subscriptionEntity.getPortion();
    this.deliveryInterval = subscriptionEntity.getDeliveryInterval();
    this.fee = subscriptionEntity.getPortion();
    this.regDate = subscriptionEntity.getRegDate();
  }
}
