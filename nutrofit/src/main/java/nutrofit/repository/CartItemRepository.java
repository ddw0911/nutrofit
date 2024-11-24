package nutrofit.repository;

import java.util.List;
import java.util.Optional;
import nutrofit.domain.entity.product.CartItem;
import nutrofit.domain.enums.MealPortion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {

  Optional<List<CartItem>> findByMember_Id(Long memberId);

  Optional<CartItem> findByMember_IdAndId(Long memberId, Long cartItemId);

  Optional<CartItem> findByMember_IdAndProduct_IdAndPortion(Long memberId, Long productId, MealPortion portion);

  void deleteByMember_id(Long memberId);
}
