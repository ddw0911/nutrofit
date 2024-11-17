package Nutrofit.dto;

import Nutrofit.domain.entity.member.MemberAdditional;
import Nutrofit.domain.enums.MealCategory;
import Nutrofit.domain.enums.MealPortion;
import Nutrofit.domain.enums.SNS;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MemberAdditionalDTO {

  private MealCategory category;
  private MealPortion portion;
  private SNS sns;

  public MemberAdditionalDTO(MemberAdditional memberAdditionalEntity) {
    this.category = memberAdditionalEntity.getCategory();
    this.portion = memberAdditionalEntity.getPortion();
    this.sns = memberAdditionalEntity.getSns();
  }

}
