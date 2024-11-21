package nutrofit.service;

import jakarta.transaction.Transactional;
import lombok.extern.log4j.Log4j2;
import nutrofit.dto.ProductDTO;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@Transactional
@Log4j2
class ProductServiceTest {

  @Autowired
  private ProductService productService;

  @Test
  void readProductTest() {
    ProductDTO dto = productService.read(7L);
    log.info(dto.toString());
  }
}