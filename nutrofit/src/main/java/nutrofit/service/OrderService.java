package nutrofit.service;

import jakarta.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import nutrofit.domain.entity.member.MemberBasic;
import nutrofit.domain.entity.orders.OrderItem;
import nutrofit.domain.entity.orders.Orders;
import nutrofit.domain.entity.orders.Payment;
import nutrofit.domain.entity.product.CartItem;
import nutrofit.domain.entity.product.Product;
import nutrofit.domain.enums.MealPortion;
import nutrofit.dto.OrderItemDTO;
import nutrofit.dto.OrdersDTO;
import nutrofit.dto.PaymentDTO;
import nutrofit.exceptions.ExceptionMessage;
import nutrofit.repository.CartItemRepository;
import nutrofit.repository.MemberBasicRepository;
import nutrofit.repository.OrderItemRepository;
import nutrofit.repository.OrdersRepository;
import nutrofit.repository.PaymentRepository;
import nutrofit.repository.ProductRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Transactional
@Log4j2
public class OrderService {

  private final MemberBasicRepository memberBasicRepository;
  private final OrdersRepository ordersRepository;
  private final OrderItemRepository orderItemRepository;
  private final ProductRepository productRepository;
  private final CartItemRepository cartItemRepository;
  private final PaymentRepository paymentRepository;

  @Transactional
  public void processOrder(Long memberId, OrdersDTO orderData, PaymentDTO paymentData) {
    saveOrderAndPayment(memberId, orderData, paymentData);
    removeOrderedItemsInCart(memberId, orderData);
  }

  @Transactional
  public void saveOrderAndPayment(Long memberId, OrdersDTO orderData, PaymentDTO paymentData) {
    MemberBasic member = memberBasicRepository.findById(memberId)
        .orElseThrow(ExceptionMessage.NOT_FOUNDED::get);

    Orders newOrder = new Orders(orderData, member);
    ordersRepository.save(newOrder);
    log.info("주문정보 데이터 저장 완료");

    for (OrderItemDTO orderItem : orderData.getOrderItems()) {
      Product product = productRepository.findById(orderItem.getProductId()).orElseThrow(
          ExceptionMessage.NOT_FOUNDED::get);

      OrderItem item = OrderItem.builder()
          .orders(newOrder)
          .product(product)
          .quantity(orderItem.getQuantity())
          .portion(MealPortion.getEnum(orderItem.getPortion()))
          .total(orderItem.getTotal())
          .build();

      orderItemRepository.save(item);
    }
    log.info("주문상품 데이터 저장 완료");

    Payment paymentInfo = Payment.builder()
        .orders(newOrder)
        .api(paymentData.getApi())
        .total(paymentData.getTotal())
        .build();

    paymentRepository.save(paymentInfo);
    log.info("결제 데이터 저장 완료");
  }

  public void removeOrderedItemsInCart(Long memberId, OrdersDTO ordersDTO) {
    List<CartItem> itemsToRemove = new ArrayList<>();

    for (OrderItemDTO orderedItem : ordersDTO.getOrderItems()) {
      CartItem cartItem = cartItemRepository.findByMember_IdAndProduct_IdAndPortion(memberId,
              orderedItem.getProductId(), MealPortion.getEnum(orderedItem.getPortion()))
          .orElseThrow(ExceptionMessage.NOT_FOUNDED::get);
      itemsToRemove.add(cartItem);
    }

    if (!itemsToRemove.isEmpty()) {
      cartItemRepository.deleteAll(itemsToRemove);
      log.info("장바구니 내 주문 완료 상품 삭제");
    }
  }
}
