package nutrofit.domain.entity.member;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import nutrofit.domain.enums.MealCategory;
import nutrofit.domain.enums.MealPortion;
import nutrofit.domain.enums.SNS;

@Entity
@Table(name = "member_additional")
@Data
@ToString(exclude = {"memberBasic"})
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MemberAdditional {

  @Id
  private Long memberId;

  @MapsId
  @OneToOne
  @JoinColumn(name = "member_id")
  private MemberBasic memberBasic;

  @Enumerated(EnumType.STRING)
  @Column(name = "interested")
  private MealCategory category;

  @Enumerated(EnumType.STRING)
  private MealPortion portion;

  @Enumerated(EnumType.STRING)
  private SNS sns;
}
