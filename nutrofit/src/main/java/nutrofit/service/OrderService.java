package nutrofit.service;

import jakarta.transaction.Transactional;
import java.util.List;
import lombok.RequiredArgsConstructor;
import nutrofit.domain.entity.member.MemberBasic;
import nutrofit.domain.entity.orders.OrderItem;
import nutrofit.domain.entity.orders.Orders;
import nutrofit.domain.entity.orders.Payment;
import nutrofit.domain.entity.product.Product;
import nutrofit.domain.enums.MealPortion;
import nutrofit.dto.OrderItemDTO;
import nutrofit.dto.OrdersDTO;
import nutrofit.dto.PaymentDTO;
import nutrofit.exceptions.ExceptionMessage;
import nutrofit.repository.MemberBasicRepository;
import nutrofit.repository.OrderItemRepository;
import nutrofit.repository.OrdersRepository;
import nutrofit.repository.PaymentRepository;
import nutrofit.repository.ProductRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {

  private final MemberBasicRepository memberBasicRepository;
  private final OrdersRepository ordersRepository;
  private final OrderItemRepository orderItemRepository;
  private final ProductRepository productRepository;
  private final PaymentRepository paymentRepository;

  public void saveOrders(Long memberId, List<OrderItemDTO> orderItems, OrdersDTO order) {

    MemberBasic member = memberBasicRepository.findById(memberId)
        .orElseThrow(ExceptionMessage.NOT_FOUNDED::get);

    Orders newOrder = new Orders(order, member);
    ordersRepository.save(newOrder);

    for (OrderItemDTO orderItem : orderItems) {
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
  }

  public void savePayment(OrdersDTO order, PaymentDTO payment) {

    Orders orderInfo = ordersRepository.findById(order.getOrdersId())
        .orElseThrow(ExceptionMessage.NOT_FOUNDED::get);

    Payment newPayment = Payment.builder()
        .orders(orderInfo)
        .api(payment.getApi())
        .total(payment.getTotal())
        .build();

    paymentRepository.save(newPayment);
  }
}
