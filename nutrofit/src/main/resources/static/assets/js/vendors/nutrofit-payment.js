// 토스페이 브랜드페이 api
// 전역 함수로 선언
window.initializePayment = async function() {

  try {
  const payButton = document.getElementById('pay-button');
  const cancelButton = document.getElementById('cancel-pay-button');
  const clientKey = "test_ck_DnyRpQWGrNzpeZ5kkmblrKwv1M9E";

    // TossPayments 인스턴스 생성
    const tossPayments = TossPayments(clientKey);

    // 고객키 생성
    const customerKey = uuid.v4().replace(/-/g, '');
    console.log("customerKey :", customerKey);


    const payment = tossPayments.payment({
          customerKey,
        });

    // 결제 금액 설정
    const totalAmount = Number(sessionStorage.getItem('payment'));

    console.log("총 결제예정금액 :",totalAmount);

    // 결제 버튼 이벤트 리스너 설정
    payButton.addEventListener("click", async function () {
        const member = localStorage.getItem('member');
        const memberData = member.replace('MemberBasic', '')  // MemberBasic 텍스트 제거
            .slice(1, -1)  // 첫 괄호와 마지막 괄호 제거
            .split(', ')  // 쉼표로 분리
            .reduce((obj, pair) => {
                const [key, value] = pair.split('=');
                obj[key] = value;
                return obj;
            }, {});

        const uniqueId = uuid.v4().replace(/-/g, '').substring(0, 8);
        const orderId = new Date().getTime() + uniqueId;
        const firstItemName = JSON.parse(localStorage.getItem('orderItems'))[0].name;
        const orderItemCount = JSON.parse(localStorage.getItem('orderItems')).length - 1;
        const orderName = `${firstItemName} 외 ${orderItemCount} 건`;
        console.log('주문이름 : ',orderName);


            await payment.requestPayment({
                method: "CARD",
                amount: {
                    currency: 'KRW',
                    value: totalAmount,
                  },
                orderId: orderId,
                orderName: orderName,
                successUrl: window.location.origin + "/",
                failUrl: window.location.origin + "/shop-checkout",
                customerName: memberData.name,
                customerEmail: memberData.email,
                card: {
                  useEscrow: false,
                  flowMode: "DEFAULT", // 통합결제창 여는 옵션
                  useCardPoint: false,
                  useAppCardOnly: false,
                },
              });
            });

  } catch (error){
    console.error("결제 API 를 불러오는 도중 문제가 발생하였습니다.", error);
  }
};

// DOM 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
  window.initializePayment().catch(error => {
    console.error('결제 위젯 초기화 실패:', error);
  });
});