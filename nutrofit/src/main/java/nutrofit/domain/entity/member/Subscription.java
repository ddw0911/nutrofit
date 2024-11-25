package nutrofit.domain.entity.member;

import nutrofit.domain.enums.DeliveryInterval;
import nutrofit.domain.enums.MealCategory;
import nutrofit.domain.enums.MealFrequency;
import nutrofit.domain.enums.UsagePeriod;
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
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Table(name = "subscription")
@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString(exclude = {"memberBasic"})
@Builder
@EntityListeners(value={AuditingEntityListener.class})
public class Subscription {

  @Id
  private Long memberId;

  @MapsId
  @OneToOne
  @JoinColumn(name = "member_id")
  private MemberBasic memberBasic;

  @Enumerated(EnumType.STRING)
  private MealCategory category;

  @Enumerated(EnumType.STRING)
  private UsagePeriod period;

  @Enumerated(EnumType.STRING)
  @Column(name = "meal_frequency")
  private MealFrequency mealFrequency;

  private Integer portion;

  @Enumerated(EnumType.STRING)
  @Column(name = "delivery_interval")
  private DeliveryInterval deliveryInterval;

  private Integer fee;

  @CreatedDate
  @Column(name="reg_date")
  private LocalDate regDate;
}
