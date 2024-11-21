package nutrofit.service;

import jakarta.transaction.Transactional;
import java.util.List;
import lombok.RequiredArgsConstructor;
import nutrofit.domain.entity.product.Product;
import nutrofit.domain.enums.MealCategory;
import nutrofit.domain.enums.MenuType;
import nutrofit.dto.ProductDTO;
import nutrofit.exceptions.ExceptionMessage;
import nutrofit.repository.ProductRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductService {

  private final ProductRepository productRepository;

  public ProductDTO read(Long productId) {
    Product product = productRepository.findById(productId).orElseThrow(
        ExceptionMessage.NOT_FOUNDED::get);
    return new ProductDTO(product);
  }

  public List<ProductDTO> getSpecialMenu(MealCategory category) {
    List<Product> productList = productRepository.findByCategory_categoryAndType(
            category, MenuType.SPECIAL)
        .orElseThrow(ExceptionMessage.NOT_FOUNDED::get);
    return productList.stream().map(this::convertToDTO).toList();
  }

  public List<ProductDTO> getSignatureMenu(MealCategory category) {
    List<Product> productList = productRepository.findByCategory_categoryAndType(
            category, MenuType.SIGNATURE)
        .orElseThrow(ExceptionMessage.NOT_FOUNDED::get);
    return productList.stream().map(this::convertToDTO).toList();
  }

  private ProductDTO convertToDTO(Product product) {
    return new ProductDTO(product);
  }
}
