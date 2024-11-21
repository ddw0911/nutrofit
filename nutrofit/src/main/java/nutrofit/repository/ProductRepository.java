package nutrofit.repository;

import java.util.List;
import java.util.Optional;
import nutrofit.domain.entity.product.Product;
import nutrofit.domain.enums.MealCategory;
import nutrofit.domain.enums.MenuType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

  Optional<Product> findById(Long id);

  Optional<List<Product>> findByCategory_categoryAndType(MealCategory category, MenuType type);
}
