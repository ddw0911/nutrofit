package nutrofit.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  @GetMapping("/status")
  public ResponseEntity<Boolean> isLoggedIn() {
    // 현재 인증된 사용자가 있는지 확인
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    boolean isAuthenticated = authentication != null && authentication.isAuthenticated() &&
        !(authentication instanceof AnonymousAuthenticationToken);
    return ResponseEntity.ok(isAuthenticated);
  }
}
