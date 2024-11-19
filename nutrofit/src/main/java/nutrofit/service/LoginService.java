package nutrofit.service;

import nutrofit.domain.entity.member.MemberBasic;
import nutrofit.exceptions.ExceptionMessage;
import nutrofit.repository.MemberBasicRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
public class LoginService implements UserDetailsService{

  private final MemberBasicRepository memberBasicRepository;

  @Override
  public MemberBasic loadUserByUsername(String email) {
    return memberBasicRepository.findByEmail(email).
        orElseThrow(ExceptionMessage.BAD_CREDENTIALS::get);
  }
}
