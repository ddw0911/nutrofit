package nutrofit.domain.entity.member;

import nutrofit.domain.enums.Gender;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@Entity
@Table(name="member_basic")
@Data
@ToString(exclude = {"memberAdditional"})
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EntityListeners(value={AuditingEntityListener.class})
public class MemberBasic implements UserDetails {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name="member_id")
  private Long id;

  private String name;
  @Column(name="email")
  private String email;
  private String password;
  @Enumerated(EnumType.STRING)
  private Gender gender;
  private String phone;
  @CreatedDate
  @Column(name="reg_date")
  private LocalDateTime regDate;
  @OneToOne(mappedBy = "memberBasic", cascade = CascadeType.ALL)
  private MemberAdditional memberAdditional;
  @OneToOne(mappedBy = "memberBasic", cascade = CascadeType.ALL)
  private Subscription subscription;
  @OneToOne(mappedBy = "memberBasic", cascade = CascadeType.ALL)
  private DeliveryInfo deliveryInfo;

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return List.of(new SimpleGrantedAuthority("user"));
  }

  @Override
  public String getUsername() {
    return email;
  }

  @Override
  public boolean isAccountNonExpired() {
    return true;
  }

  @Override
  public boolean isAccountNonLocked() {
    return true;
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return true;
  }

  @Override
  public boolean isEnabled() {
    return true;
  }

//  권한 및 마이프로필 기능은 없기 때문에 해당 부분 구현 보류
}
