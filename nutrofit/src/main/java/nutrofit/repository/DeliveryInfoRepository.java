package nutrofit.repository;

import nutrofit.domain.entity.member.DeliveryInfo;
import org.springframework.data.jpa.repository.JpaRepository;

//@Repository
public interface DeliveryInfoRepository extends JpaRepository<DeliveryInfo, Long> {
}
