package Nutrofit.repository;

import Nutrofit.domain.entity.member.MemberBasic;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MemberBasicRepository extends JpaRepository<MemberBasic, Long> {

  Optional<MemberBasic> findByEmail(String email);
  boolean existsByEmail(String email);
}
