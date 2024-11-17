package Nutrofit.dto;

import Nutrofit.domain.entity.member.Subscription;
import Nutrofit.domain.enums.DeliveryInterval;
import Nutrofit.domain.enums.MealCategory;
import Nutrofit.domain.enums.MealFrequency;
import Nutrofit.domain.enums.UsagePeriod;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

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
