package nutrofit.domain.entity.member;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.util.Objects;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import nutrofit.dto.DeliveryInfoDTO;

@Entity
@Table(name="delivery_info")
@Data
@ToString(exclude = "memberBasic")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DeliveryInfo {
  @Id
  private Long memberId;

  @OneToOne
  @MapsId
  @JoinColumn(name = "member_id")
  private MemberBasic memberBasic;

  private String name;
  private String phone;
  private String address;
  @Column(name="detail_address")
  private String detailAddress;
  private String requirement;

  @Builder
  public DeliveryInfo(MemberBasic memberBasic) {
    this.memberBasic = Objects.requireNonNull(memberBasic);
    // @MapsId가 memberBasic 의 ID를 memberId로 자동 매핑
  }

  public void update(DeliveryInfoDTO dto) {
    this.name = dto.getName();
    this.phone = dto.getPhone();
    this.address = dto.getAddress();
    this.detailAddress = dto.getDetailAddress();
  }

  public void updateRequirement(String requirement) {
    this.requirement = requirement;
  }
}
