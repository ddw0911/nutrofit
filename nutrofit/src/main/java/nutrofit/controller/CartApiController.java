package nutrofit.controller;

import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import nutrofit.domain.entity.member.MemberBasic;
import nutrofit.domain.enums.MealPortion;
import nutrofit.dto.CartItemDTO;
import nutrofit.service.CartService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@Log4j2
public class CartApiController {

  private final CartService cartService;


  // 장바구니 동기화
  @PostMapping("/sync")
  public ResponseEntity<String> syncCart(@RequestBody List<CartItemDTO> cartItems) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

    if (authentication == null || authentication.getPrincipal().equals("anonymousUser")) {
      log.warn("비로그인 사용자가 장바구니 동기화 요청을 시도했습니다.");
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
    }

    // 빈 장바구니 체크
    if (cartItems == null || cartItems.isEmpty()) {
      log.warn("빈 장바구니 동기화 시도");
      return ResponseEntity.ok("빈 장바구니입니다.");
    }

    Long memberId = cartItems.get(0).getMemberId();

    try {
      cartService.syncCart(memberId, cartItems);
      log.info("로그인 사용자 [{}]의 장바구니 동기화 완료", memberId);
      return ResponseEntity.ok("장바구니 동기화 성공");
    } catch (Exception e) {
      log.error("장바구니 동기화 중 오류 발생", e);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("장바구니 동기화 실패");
    }
  }

  @GetMapping
  public ResponseEntity<List<CartItemDTO>> getCart() {
    // 비로그인 상태일 때
    if (!SecurityContextHolder.getContext().getAuthentication().isAuthenticated()
        || SecurityContextHolder.getContext().getAuthentication().getPrincipal().equals("anonymousUser")) {
      return ResponseEntity.ok(new ArrayList<>());  // 빈 리스트 반환
    }

    // 로그인 상태일 때
    MemberBasic member = (MemberBasic) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    List<CartItemDTO> cartItems = cartService.getCartItems(member.getId());
    return ResponseEntity.ok(cartItems);
  }

  // 특정 회원의 장바구니 조회
  @GetMapping("/{memberId}")
  public ResponseEntity<List<CartItemDTO>> getCartItems(@PathVariable Long memberId) {
    List<CartItemDTO> cartItems = cartService.getCartItems(memberId);
    log.info("회원 ID {}의 장바구니 항목: {}", memberId, cartItems);
    return ResponseEntity.ok(cartItems);
  }

  //
  @PostMapping("/{memberId}")
  public ResponseEntity<String> addCartItem(@PathVariable(required = false) Long memberId, @RequestBody CartItemDTO cartItemDTO) {
    if (memberId == null || SecurityContextHolder.getContext().getAuthentication().getPrincipal().equals("anonymousUser")) {
      // 비로그인 상태 - Local Storage 를 통해 임시 저장
      log.info("비로그인 사용자의 임시 장바구니에 상품 추가 요청: {}", cartItemDTO);
      // 장바구니 데이터를 로컬 스토리지에 저장하는 로직 추가
      return ResponseEntity.ok("비로그인 상태에서 장바구니에 상품이 추가되었습니다.");
    }

    cartItemDTO.setMemberId(memberId); // DTO 에 회원 ID 설정
    cartService.addCartItem(cartItemDTO);
    log.info("회원 ID {}의 장바구니에 항목 추가: {}", memberId, cartItemDTO);
    return ResponseEntity.ok("장바구니에 항목이 추가되었습니다.");
  }

  // 장바구니 항목 삭제
  @DeleteMapping("/{memberId}/delete/{productId}/{portion}")
  public ResponseEntity<String> removeCartItem(@PathVariable Long memberId, @PathVariable Long productId, @PathVariable MealPortion portion) {
    cartService.removeCartItem(memberId, productId, portion);
    log.info("회원 ID {}의 장바구니에서 제품 ID {} {} 삭제", memberId, productId, portion.get());
    return ResponseEntity.ok("장바구니 항목이 삭제되었습니다.");
  }
}
