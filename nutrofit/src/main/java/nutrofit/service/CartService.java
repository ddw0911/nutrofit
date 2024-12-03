package nutrofit.service;

import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import nutrofit.domain.entity.member.MemberBasic;
import nutrofit.domain.entity.product.CartItem;
import nutrofit.domain.entity.product.Product;
import nutrofit.domain.enums.MealPortion;
import nutrofit.dto.CartItemDTO;
import nutrofit.exceptions.ExceptionMessage;
import nutrofit.repository.CartItemRepository;
import nutrofit.repository.MemberBasicRepository;
import nutrofit.repository.ProductRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Transactional
@Log4j2
public class CartService {

  private final CartItemRepository cartItemRepository;
  private final MemberBasicRepository memberBasicRepository;
  private final ProductRepository productRepository;

  public List<CartItemDTO> getCartItems(Long memberId) {
    List<CartItem> cartItems = cartItemRepository.findByMember_Id(memberId).orElseThrow(
        ExceptionMessage.NOT_FOUNDED::get);
    log.info("장바구니 목록 : ");
    cartItems.forEach(cartItem -> log.info(cartItem.toString())); // 장바구니 목록 확인 로그
    return cartItems.stream().map(CartItemDTO::new).collect(Collectors.toList());
  }

  public void addCartItem(CartItemDTO cartItemDTO) {
    Optional<CartItem> newItem = cartItemRepository.findByMember_IdAndProduct_IdAndPortion(
            cartItemDTO.getMemberId(),
            cartItemDTO.getProductId(), MealPortion.getEnum(cartItemDTO.getPortion()));

    if (newItem.isPresent()) {
      CartItem existingItem = newItem.get();
      existingItem.setQuantity(cartItemDTO.getQuantity());
      existingItem.setTotal(cartItemDTO.getTotal());
      cartItemRepository.save(existingItem);

      log.info(existingItem.updateSuccess());
    } else {
      MemberBasic member = memberBasicRepository.findById(cartItemDTO.getMemberId())
          .orElseThrow(ExceptionMessage.NOT_FOUNDED::get);
      Product product = productRepository.findById(cartItemDTO.getProductId())
          .orElseThrow(ExceptionMessage.NOT_FOUNDED::get);
      CartItem newCartItem = new CartItem(cartItemDTO, member, product);
      cartItemRepository.save(newCartItem);

      log.info(newCartItem.addSuccess()); // 장바구니 등록 상품 정보 및 성공 메시지
    }
  }

  public void removeCartItem(Long memberId, Long productId, MealPortion portion) {
    CartItem cartItem = cartItemRepository.findByMember_IdAndProduct_IdAndPortion(memberId, productId, portion)
        .orElseThrow(ExceptionMessage.NOT_FOUNDED::get);

    cartItemRepository.delete(cartItem);
    log.info("{} 장바구니 목록에서 제거", cartItem.getProduct().getName());
  }

  public void syncCart(Long memberId, List<CartItemDTO> cartItems) {

    for (CartItemDTO newItem : cartItems) {
      Optional<CartItem> cartItem = cartItemRepository.findByMember_IdAndProduct_IdAndPortion(
          memberId, newItem.getProductId(), MealPortion.getEnum(newItem.getPortion()));

      if (cartItem.isPresent()) {
        CartItem existingItem = cartItem.get();
        existingItem.setQuantity(newItem.getQuantity());
        existingItem.setTotal(newItem.getTotal());
        cartItemRepository.save(existingItem);

        log.info(existingItem.updateSuccess());
      } else {
        MemberBasic member = memberBasicRepository.findById(memberId)
            .orElseThrow(ExceptionMessage.NOT_FOUNDED::get);
        Product product = productRepository.findById(newItem.getProductId())
            .orElseThrow(ExceptionMessage.NOT_FOUNDED::get);
        try {
          CartItem newCartItem = new CartItem(newItem, member, product);
          log.info("New Cart Item: {}", newCartItem);
          cartItemRepository.save(newCartItem);
          log.info(newCartItem.addSuccess()); // 장바구니 등록 상품 정보 및 성공 메시지
        } catch (Exception e) {
          e.printStackTrace();
        }
      }
    }
  }
}
