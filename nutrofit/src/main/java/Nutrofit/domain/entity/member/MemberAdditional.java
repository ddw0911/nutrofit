package Nutrofit.domain.entity.member;

import Nutrofit.domain.enums.MealCategory;
import Nutrofit.domain.enums.MealPortion;
import Nutrofit.domain.enums.SNS;
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
