package nutrofit.repository;

import java.util.Optional;
import nutrofit.domain.entity.product.Category;
import nutrofit.domain.enums.MealCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
  Optional<Category> findByCategory(MealCategory category);
}
