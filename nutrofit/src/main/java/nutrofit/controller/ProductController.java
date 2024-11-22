package nutrofit.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import nutrofit.domain.enums.MealCategory;
import nutrofit.dto.CategoryDTO;
import nutrofit.dto.ProductDTO;
import nutrofit.service.ProductService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/menu")
@RequiredArgsConstructor
public class ProductController {

  private final ProductService productService;

  @GetMapping("/{category}")
  public Map<String, Object> getCategoryMenu(@PathVariable MealCategory category) {

    CategoryDTO categoryInfo = productService.getCategoryInfo(category);
    List<ProductDTO> special = productService.getSpecialMenu(category);
    List<ProductDTO> signature = productService.getSignatureMenu(category);

    Map<String, Object> response = new HashMap<>();

    response.put("categoryInfo", categoryInfo);
    response.put("special", special);
    response.put("signature", signature);

    return response;
  }
}
