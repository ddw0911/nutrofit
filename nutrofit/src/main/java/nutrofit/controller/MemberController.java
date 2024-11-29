package nutrofit.controller;

import nutrofit.dto.MemberAdditionalDTO;
import nutrofit.dto.MemberBasicDTO;
import nutrofit.repository.MemberBasicRepository;
import nutrofit.service.SignupService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequiredArgsConstructor
@Log4j2
public class MemberController {

  private final MemberBasicRepository memberBasicRepository;
  private final SignupService signupService;

  @GetMapping("/signup/email-duplicate-check")
  public ResponseEntity<Boolean> checkDuplicated(@RequestParam String email) {
    //공백 시 잘못된 요청 처리
    if (email == null || email.isBlank()) {
      return ResponseEntity.badRequest().body(false);
    }
    boolean isDuplicate = memberBasicRepository.existsByEmail(email.toLowerCase());
    return ResponseEntity.ok(isDuplicate);
  }

  @PostMapping("/signup")
  public String signup(@Validated MemberBasicDTO required, MemberAdditionalDTO additional,
      BindingResult bindingResult) {
    if (bindingResult.hasErrors()) {
      log.error("유효성 검사 실패 : " + bindingResult.getAllErrors());
      return "signup";
    }

    if (memberBasicRepository.existsByEmail(required.getEmail())) {
      bindingResult.rejectValue("email", "duplicated", "이미 사용 중인 이메일입니다.");
      return "signup";
    }

    signupService.register(required, additional);
    log.info("필수입력항목 데이터 : " + required);
    if (additional != null) {
      log.info("선택입력항목 데이터 : " + additional);
    }

    return "redirect:/signin";
  }
}
