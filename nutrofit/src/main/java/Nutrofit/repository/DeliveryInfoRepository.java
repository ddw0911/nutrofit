package Nutrofit.repository;

import Nutrofit.domain.entity.member.DeliveryInfo;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

//@Repository
public interface DeliveryInfoRepository extends JpaRepository<DeliveryInfo, Long> {
  Optional<DeliveryInfo> findByMemberBasicEmail(String email);
}
