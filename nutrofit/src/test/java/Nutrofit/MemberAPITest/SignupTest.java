package Nutrofit.MemberAPITest;

import static org.junit.jupiter.api.Assertions.assertNotNull;

import Nutrofit.domain.enums.Gender;
import Nutrofit.dto.MemberBasicDTO;
import Nutrofit.service.SignupService;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class SignupTest {

  @Autowired
  private SignupService signupService;

  @Test
  public void signupTest() {
    MemberBasicDTO test = MemberBasicDTO.builder()
        .name("test1")
        .email("test@gmail.com")
        .password("test1password!")
        .gender(Gender.MALE)
        .phone("01012341234")
        .build();

    Long memberId = signupService.register(test, null);
    assertNotNull(memberId, "회원가입실패");
  }
}
