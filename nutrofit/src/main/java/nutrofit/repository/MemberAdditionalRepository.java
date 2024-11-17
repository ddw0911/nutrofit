package nutrofit.repository;

import nutrofit.domain.entity.member.MemberAdditional;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MemberAdditionalRepository extends JpaRepository<MemberAdditional, Long> {
  Optional<MemberAdditional> findByMemberBasicEmail(String email);
}
