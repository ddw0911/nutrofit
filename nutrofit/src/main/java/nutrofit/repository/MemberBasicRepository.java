package nutrofit.repository;

import java.util.Optional;
import nutrofit.domain.entity.member.MemberBasic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MemberBasicRepository extends JpaRepository<MemberBasic, Long> {

  Optional<MemberBasic> findById(Long id);
  Optional<MemberBasic> findByEmail(String email);
  boolean existsByEmail(String email);
}
