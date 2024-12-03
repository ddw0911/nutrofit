package nutrofit.service;

import nutrofit.domain.entity.member.MemberAdditional;
import nutrofit.domain.entity.member.MemberBasic;
import nutrofit.dto.MemberAdditionalDTO;
import nutrofit.dto.MemberBasicDTO;
import nutrofit.repository.MemberAdditionalRepository;
import nutrofit.repository.MemberBasicRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class SignupService {

  private final MemberBasicRepository memberBasicRepository;
  private final MemberAdditionalRepository memberAdditionalRepository;
  private final BCryptPasswordEncoder bCryptPasswordEncoder;


  @Transactional
  public Long register(MemberBasicDTO required, MemberAdditionalDTO optional) {

    // 이메일 중복확인
    if (memberBasicRepository.existsByEmail(required.getEmail())) {
      throw new IllegalArgumentException("이미 존재하는 이메일입니다.");
    }
    // 비밀번호 유효성 검사
    if (!isValidPassword(required.getPassword())) {
      throw new IllegalArgumentException("비밀번호가 유효하지 않습니다.");
    }

    MemberBasic requiredInfo = MemberBasic.builder()
        .name(required.getName())
        .email(required.getEmail())
        .password(bCryptPasswordEncoder.encode(required.getPassword()))
        .gender(required.getGender())
        .phone(required.getPhone())
        .build();

    memberBasicRepository.save(requiredInfo);

    if (optional != null) {
      MemberAdditional additionalInfo = MemberAdditional.builder()
          .memberBasic(requiredInfo)
          .category(optional.getCategory())
          .portion(optional.getPortion())
          .sns(optional.getSns())
          .build();

      memberAdditionalRepository.save(additionalInfo);
    }
    return requiredInfo.getId();
  }

  // 비밀번호 유효성 검사
  private boolean isValidPassword(String password) {
    String passwordRegex = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[!@#$%^&*])[A-Za-z\\d!@#$%^&*]{8,20}$";
    return password != null && password.matches(passwordRegex);
  }
}
