package Nutrofit.service;

import Nutrofit.domain.entity.member.MemberBasic;
import Nutrofit.exceptions.MemberException;
import Nutrofit.repository.MemberBasicRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
public class LoginService implements UserDetailsService{

  private final MemberBasicRepository memberBasicRepository;

  @Override
  public MemberBasic loadUserByUsername(String email) {
    return memberBasicRepository.findByEmail(email).
        orElseThrow(MemberException.BAD_CREDENTIALS::get);
  }
}
