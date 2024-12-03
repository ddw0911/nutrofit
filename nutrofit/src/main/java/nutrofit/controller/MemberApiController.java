package nutrofit.controller;

import nutrofit.domain.entity.member.MemberBasic;
import nutrofit.domain.enums.MealCategory;
import nutrofit.domain.enums.MealPortion;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/member")
public class MemberApiController {

  @GetMapping("/status")
  public ResponseEntity<Boolean> isLoggedIn() {
    // 현재 인증된 사용자가 있는지 확인
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    boolean isAuthenticated = authentication != null && authentication.isAuthenticated() &&
        !(authentication instanceof AnonymousAuthenticationToken);
    return ResponseEntity.ok(isAuthenticated);
  }

  @GetMapping("/category")
  public ResponseEntity<?> getCategory(@AuthenticationPrincipal MemberBasic member){
    // 비로그인 상태일 때
    if (member == null) {
      return ResponseEntity.ok(MealCategory.BALANCE); // 비로그인 사용자는 기본값 반환
    }
    // 로그인 상태일 때
    MealCategory category = member.getMemberAdditional().getCategory();
    if (category == null) {
      return ResponseEntity.ok(MealCategory.BALANCE); // 기본화면으로 BALANCE 식단
    }
    return ResponseEntity.ok(category); // 회원가입 시 선택한 식단
  }

  @GetMapping("/portion")
  public ResponseEntity<?> getMemberPortion(@AuthenticationPrincipal MemberBasic member) {
    if (member == null) {
      return ResponseEntity.ok(MealPortion.ONE.get()); // 비로그인 사용자는 기본값
    }

    MealPortion portion = member.getMemberAdditional().getPortion();
    if (portion == null) {
      return ResponseEntity.ok(MealPortion.ONE.get()); // portion 정보가 없으면 기본값
    }

    return ResponseEntity.ok(portion.get());
  }
}
