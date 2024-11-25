package nutrofit.controller;

import lombok.RequiredArgsConstructor;
import nutrofit.domain.entity.member.MemberBasic;
import nutrofit.dto.DeliveryInfoDTO;
import nutrofit.service.CheckoutService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
@RequiredArgsConstructor
public class ViewController {

  private final CheckoutService checkoutService;

  @GetMapping("/")
  public String home() {
    return "nutrofit";
  }

  @GetMapping("/signin")
  public String signin() {
    return "signin";
  }

  @GetMapping("/signup")
  public String signup() {
    return "signup";
  }

  @GetMapping("/subscribe")
  public String subscribe() {
    return "subscription";
  }

  @GetMapping("/checkout/shop")
  public String getDefaultAddress(@AuthenticationPrincipal MemberBasic member, Model model) {
    DeliveryInfoDTO defaultAddress = checkoutService.getDefaultDeliveryInfo(member.getId());
    model.addAttribute("deliveryInfo", defaultAddress);
    return "shop-checkout";
  }
}
