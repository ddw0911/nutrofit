package Nutrofit.dto;

import Nutrofit.domain.entity.member.DeliveryInfo;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

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
