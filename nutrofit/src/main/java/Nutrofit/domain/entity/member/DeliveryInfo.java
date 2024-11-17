package Nutrofit.domain.entity.member;

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

@Entity
@Table(name="delivery_info")
@Data
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DeliveryInfo {
  @Id
  private Long memberId;

  @MapsId
  @OneToOne
  @JoinColumn(name = "member_id")
  private MemberBasic memberBasic;

  private String name;
  private String phone;
  private String address;
  @Column(name="detail_address")
  private String detailAddress;
  private String requirement;
}
