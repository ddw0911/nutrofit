package nutrofit.dto;

import nutrofit.domain.entity.member.DeliveryInfo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DeliveryInfoDTO {

  private String name;
  private String phone;
  private String address;
  private String detailAddress;
  private String requirement;

  public DeliveryInfoDTO(DeliveryInfo deliveryInfoEntity) {
    this.name = deliveryInfoEntity.getName();
    this.phone = deliveryInfoEntity.getPhone();
    this.address = deliveryInfoEntity.getAddress();
    this.detailAddress = deliveryInfoEntity.getDetailAddress();
    this.requirement = deliveryInfoEntity.getRequirement();
  }
}
