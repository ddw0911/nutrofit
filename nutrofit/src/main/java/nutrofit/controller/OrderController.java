package nutrofit.controller;

import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import nutrofit.domain.entity.member.MemberBasic;
import nutrofit.dto.OrderItemDTO;
import nutrofit.dto.OrdersDTO;
import nutrofit.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/")
@RequiredArgsConstructor
@Log4j2
public class OrderController {

  private final String TOSS_SECRET_KEY = "test_ck_DnyRpQWGrNzpeZ5kkmblrKwv1M9E";
  private final OrderService orderService;

  @GetMapping("/order")
  public ResponseEntity<?> order(@AuthenticationPrincipal MemberBasic member,
      @RequestBody List<OrderItemDTO> orderItemList, @RequestBody OrdersDTO order) {
    orderService.saveOrders(member.getId(), orderItemList, order);
    return ResponseEntity.ok("주문이 완료되었습니다.");
  }
}
