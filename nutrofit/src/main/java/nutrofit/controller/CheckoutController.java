package nutrofit.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import nutrofit.domain.entity.member.DeliveryInfo;
import nutrofit.domain.entity.member.MemberBasic;
import nutrofit.dto.DeliveryInfoDTO;
import nutrofit.service.CheckoutService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/")
@Log4j2
public class CheckoutController {

  private final CheckoutService checkoutService;

  @PatchMapping("/checkout/deliveryInfo")
  public ResponseEntity<?> changeDeliveryInfo(@RequestBody DeliveryInfoDTO deliveryInfoDTO,
      @AuthenticationPrincipal MemberBasic member) {
    try {
      DeliveryInfo updatedInfo = checkoutService.updateDeliveryInfo(member.getId(),
          deliveryInfoDTO);
      return ResponseEntity.ok(new DeliveryInfoDTO(updatedInfo));
    } catch (Exception e){
      return ResponseEntity.badRequest().body("배송정보 업데이트 도중 에러 발생");
    }
  }
}
