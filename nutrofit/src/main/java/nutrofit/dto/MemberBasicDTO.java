package nutrofit.dto;

import nutrofit.domain.entity.member.MemberBasic;
import nutrofit.domain.enums.Gender;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MemberBasicDTO {

  private Long id;
  private String name;
  private String email;
  private String password;
  private Gender gender;
  private String phone;
  private LocalDateTime regDate;
  private MemberAdditionalDTO memberAdditional;

  public MemberBasicDTO(MemberBasic memberBasicEntity) {
    this.id = memberBasicEntity.getId();
    this.name = memberBasicEntity.getName();
    this.email = memberBasicEntity.getEmail();
    this.password = memberBasicEntity.getPassword();
    this.gender = memberBasicEntity.getGender();
    this.phone = memberBasicEntity.getPhone();
    this.regDate = memberBasicEntity.getRegDate();
  }
}
