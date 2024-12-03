package nutrofit.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import nutrofit.domain.entity.member.MemberBasic;
import nutrofit.dto.OrderRequestDTO;
import nutrofit.dto.OrdersDTO;
import nutrofit.dto.PaymentDTO;
import nutrofit.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/order")
@RequiredArgsConstructor
@Log4j2
public class OrderApiController {

  private final OrderService orderService;

  @PostMapping("/payment/save")
  public ResponseEntity<String> order(@AuthenticationPrincipal MemberBasic member,
      @RequestBody OrderRequestDTO orderRequestDTO) {

    OrdersDTO orderData = orderRequestDTO.getOrderData();
    PaymentDTO paymentData = orderRequestDTO.getPaymentData();

    orderService.processOrder(member.getId(), orderData, paymentData);
    return ResponseEntity.ok("주문이 완료되었습니다.");
  }
}
