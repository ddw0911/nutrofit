package nutrofit.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import nutrofit.domain.enums.MealCategory;
import nutrofit.dto.CategoryDTO;
import nutrofit.dto.ProductDTO;
import nutrofit.service.ProductService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/menu")
@RequiredArgsConstructor
@Log4j2
public class ProductApiController {

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

  @PostMapping("/{productDetails}")
  public ProductDTO getProductDetails(@PathVariable Long id) {
    ProductDTO product = productService.read(id);
    log.info(product.toString());
    return product;
  }
}
