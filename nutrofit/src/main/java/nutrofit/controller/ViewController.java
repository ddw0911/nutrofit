package nutrofit.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ViewController {

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
  public String shopCheckout() {
    return "shop-checkout";
  }
}
