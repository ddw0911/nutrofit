// 멤버 데이터 가져오기
function getMemberData() {
   const member = localStorage.getItem('member');
   return member.replace('MemberBasic', '')
       .slice(1, -1)
       .split(', ')
       .reduce((obj, pair) => {
           const [key, value] = pair.split('=');
           obj[key] = value;
           return obj;
       }, {});
}

// 주문한 상품은 장바구니에서 삭제
async function removeOrderedItemsFromCart(orderItems) {
    const memberId = getMemberData().id;

    for (const orderItem of orderItems) {
        const portion = orderItem.selectedPortion === '1인분' ? 'ONE' :
                       orderItem.selectedPortion === '2인분' ? 'TWO' : 'FOUR';
        try {
            await fetch(`/api/cart/${memberId}/delete/${orderItem.id}/${portion}`, {
                method: 'DELETE'
            });
        } catch (error) {
            console.error('장바구니 항목 삭제 실패:', error);
        }
    }
}

// 세션 정리 함수
function cleanupSession() {
   sessionStorage.clear();
   localStorage.removeItem('orderItems');
}

// 토스페이 브랜드페이 api
window.initializePayment = async function() {
   const payButton = document.getElementById('pay-button');
   const cancelButton = document.getElementById('cancel-pay-button');
   const clientKey = "test_ck_DnyRpQWGrNzpeZ5kkmblrKwv1M9E";

   try {
       // TossPayments 인스턴스 생성
       const tossPayments = TossPayments(clientKey);

       // 고객키 생성
       const customerKey = uuid.v4().replace(/-/g, '');
       console.log("customerKey :", customerKey);

       // 결제창 초기화
       const payment = tossPayments.payment({ customerKey });

       // 결제 금액 설정
       const totalAmount = Number(sessionStorage.getItem('totalAmount'));
       console.log("총 결제예정금액 :", totalAmount);

       // 결제 버튼 이벤트 리스너 설정
       payButton.addEventListener("click", async function() {
           try {
               // 결제동의 체크박스 검증
               const paymentCheckbox = document.getElementById("payment-agree-checkbox");
               if (!paymentCheckbox.checked) {
                   alert("결제 내용을 확인하고 동의해 주세요.");
                   return;
               }

               // 회원 데이터 준비
               const memberData = getMemberData();

               // 주문 데이터 준비
               const uniqueId = uuid.v4().replace(/-/g, '').substring(0, 8);
               const orderId = new Date().getTime() + uniqueId;
               const orderItems = JSON.parse(localStorage.getItem('orderItems'));
               const firstItemName = orderItems[0].name;
               const orderItemCount = orderItems.length - 1;
               const orderName = `${firstItemName} 외 ${orderItemCount} 건`;
               sessionStorage.setItem('orderName', orderName);
               console.log('주문이름 : ', orderName);

               // 결제 요청
               await payment.requestPayment({
                   method: "CARD",
                   amount: {
                       currency: 'KRW',
                       value: totalAmount,
                   },
                   orderId: orderId,
                   orderName: orderName,
                   successUrl: window.location.origin + "/payment?success=true",
                   failUrl: window.location.origin + "/api/order/payment?success=false",
                   customerName: memberData.name,
                   customerEmail: memberData.email,
                   card: {
                       useEscrow: false,
                       flowMode: "DEFAULT",
                       useCardPoint: false,
                       useAppCardOnly: false,
                   },
               });

           } catch (error) {
               console.error("결제 처리 중 오류 발생:", error);
               alert('결제 처리 중 오류가 발생했습니다.');
           }
       });

   } catch (error) {
       console.error("결제 초기화 중 오류 발생:", error);
       alert('결제 시스템을 초기화하는 중 오류가 발생했습니다.');
   }
};

// 모달 확인 버튼 클릭 이벤트
document.getElementById('payment-success-ok')?.addEventListener('click', async function() {
   try {
       const deliveryInfo = JSON.parse(sessionStorage.getItem('deliveryInfo'));

       const orderItemInfo = JSON.parse(localStorage.getItem('orderItems')).map(item => ({
           productId: item.id,               // 상품 ID
           quantity: item.quantity,          // 수량
           portion: item.selectedPortion,    // 선택된 portion (예: "1인분")
           total: item.price * item.quantity // 해당 상품의 총 금액
       }));

       const orderData = {
           memberId: deliveryInfo.memberId,
           orderName: sessionStorage.getItem('orderName'),
           name: deliveryInfo.name,
           phone: deliveryInfo.phone,
           address: `${deliveryInfo.address} ${deliveryInfo.detailAddress}`,
           requirement: deliveryInfo.requirement,
           total: sessionStorage.getItem('totalAmount'),
           orderItems: orderItemInfo,
       };

       const paymentData = {
           api: "TOSS",  // 카드 결제로 고정
           total: Number(sessionStorage.getItem('totalAmount')),
       };

       console.log(JSON.stringify(orderData, null, 2)); // JSON 문자열 출력
       console.table(paymentData);

       // 주문 정보 서버 전송
       const serverResponse = await fetch('/api/order/payment/save', {
           method: 'POST',
           headers: {
               'Content-Type': 'application/json',
           },
           body: JSON.stringify({
               orderData: orderData,
               paymentData: paymentData,
           })
       });

       const data = await serverResponse.text();
       console.log('서버응답 : ', data);

       // 장바구니에서 주문 상품 제거
       const orderItems = JSON.parse(localStorage.getItem('orderItems'));
       const cartItems = JSON.parse(localStorage.getItem('cart'));

       if (cartItems && orderItems) {
           // 로컬 장바구니 업데이트
           const updatedCart = cartItems.filter(cartItem =>
               !orderItems.some(orderItem =>
                   orderItem.id === cartItem.id &&
                   orderItem.selectedPortion === cartItem.selectedPortion
               )
           );
           localStorage.setItem('cart', JSON.stringify(updatedCart));

           // 서버 장바구니 업데이트
           await removeOrderedItemsFromCart(orderItems);
       }

       // 세션 정리
       cleanupSession();

       // 홈페이지로 이동
       window.location.href = '/';

   } catch (error) {
       console.error('주문 처리 중 오류 발생:', error);
       alert('주문 처리 중 오류가 발생했습니다.');
   }
});

// DOM 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
   // URL 파라미터 체크
   const urlParams = new URLSearchParams(window.location.search);
   if (urlParams.get('payment') === 'success') {
       // 결제 성공 모달 표시
       const paymentSuccessMessage = new bootstrap.Modal(document.getElementById('PaymentSuccessModal'));
       paymentSuccessMessage.show();
   }

   // 결제 초기화
   window.initializePayment().catch(error => {
       console.error('결제 위젯 초기화 실패:', error);
   });
});