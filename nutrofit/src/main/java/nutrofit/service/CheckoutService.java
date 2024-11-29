package nutrofit.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import nutrofit.domain.entity.member.DeliveryInfo;
import nutrofit.domain.entity.member.MemberBasic;
import nutrofit.dto.DeliveryInfoDTO;
import nutrofit.exceptions.ExceptionMessage;
import nutrofit.repository.DeliveryInfoRepository;
import nutrofit.repository.MemberBasicRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Transactional
@Log4j2
public class CheckoutService {

  private final MemberBasicRepository memberBasicRepository;
  private final DeliveryInfoRepository deliveryInfoRepository;

  @Transactional
  public DeliveryInfoDTO getDefaultDeliveryInfo(Long memberId) {
    MemberBasic member = memberBasicRepository.findById(memberId)
        .orElseThrow(ExceptionMessage.NOT_FOUNDED::get);

    // 배송지 정보 조회 또는 생성
    DeliveryInfo deliveryInfo = deliveryInfoRepository.findById(memberId)
        .orElseGet(() -> {
          // 배송지 레코드 생성
          log.info("{} 배송지 정보 생성", memberId);
          DeliveryInfo newDeliveryInfo = DeliveryInfo.builder()
              .memberBasic(member)
              .build();
          return deliveryInfoRepository.save(newDeliveryInfo);
        });

    return new DeliveryInfoDTO(deliveryInfo);
  }

  @Transactional
  public DeliveryInfo updateDeliveryInfo(Long id, DeliveryInfoDTO dto) {
    DeliveryInfo deliveryInfo = deliveryInfoRepository.findById(id)
        .orElseThrow(ExceptionMessage.NOT_FOUNDED::get);

    deliveryInfo.update(dto);  // 기존 객체 수정
    return deliveryInfo;       // save 불필요
  }

  public String getDeliveryRequirement(Long memberId) {
    DeliveryInfo deliveryInfo = deliveryInfoRepository.findById(memberId)
        .orElseThrow(ExceptionMessage.NOT_FOUNDED::get);
    return deliveryInfo.getRequirement();
  }

  @Transactional
  public DeliveryInfo updateDeliveryRequirement(Long memberId, String requirement) {

    DeliveryInfo deliveryInfo = deliveryInfoRepository.findById(memberId)
        .orElseThrow(ExceptionMessage.NOT_FOUNDED::get);

    // requirement 만 업데이트
    deliveryInfo.updateRequirement(requirement);
    return deliveryInfo;
  }
}
