// 카카오 주소찾기 api
function searchAddress() {
   new daum.Postcode({
       oncomplete: function(data) {
           document.getElementById('address').value = data.address;
           document.getElementById('detailAddress').focus();
       }
   }).open();
}

// 결제페이지 렌더링시
document.addEventListener('DOMContentLoaded', function() {

    const deliveryInfoCheck = localStorage.getItem('member').match(/deliveryInfo=DeliveryInfo\((.*?)\)/);
    if(deliveryInfoCheck){
          const deliveryInfoStr = deliveryInfoCheck[1];
          const requirement = document.querySelector('.order-requirement-select').value;

          const deliveryInfo = deliveryInfoStr.split(', ')
              .reduce((obj, item) => {
                  const [key, value] = item.split('=');
                  obj[key] = value;
                  return obj;
              }, {});

          deliveryInfo.requirement = requirement;
          sessionStorage.setItem('deliveryInfo', JSON.stringify(deliveryInfo));
    }




    localStorage.setItem('orderItems', localStorage.getItem('cart'));

     // OrderItemsManager 초기화
        const orderManager = new OrderItemsManager();
        orderManager.init();
});

// 배송정보등록 모달 함수
document.addEventListener('DOMContentLoaded', function() {
  const addressForm = document.getElementById('changeAddressForm');

  addressForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    // Bootstrap 유효성 검사 스타일 적용
    this.classList.add('was-validated');

    // 폼 유효성 검사
    if (!this.checkValidity()) {
      e.stopPropagation();
      return;
    }

    // 버튼 비활성화 (중복 제출 방지)
    const submitButton = this.querySelector('button[type="submit"]');
    submitButton.disabled = true;

    const formData = {
      name: document.querySelector('input[aria-label="수령인이름"]').value.trim(),
      phone: document.querySelector('input[aria-label="수령인연락처"]').value.trim(),
      address: document.querySelector('input[aria-label="배송지주소"]').value.trim(),
      detailAddress: document.querySelector('input[aria-label="상세주소"]').value.trim()
    };

    try {
      const response = await fetch('/api/checkout/deliveryInfo', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('서버 요청 실패');
      }

      const result = await response.json();

      // 모달 닫기
      const modal = bootstrap.Modal.getInstance(document.querySelector('#addAddressModal'));
      modal.hide();

      // UI 업데이트
      updateDeliveryInfoDisplay(formData);
      sessionStorage.setItem('deliveryInfo', JSON.stringify(result));
      alert('배송정보가 성공적으로 변경되었습니다.');

    } catch (error) {
      console.error('Error:', error);
      alert('배송정보 변경 중 오류가 발생했습니다.');
    } finally {
      // 버튼 다시 활성화
      submitButton.disabled = false;
      // 폼 초기화
      this.classList.remove('was-validated');
      this.reset();
    }
  });
});

// 배송정보 업데이트 함수
function updateDeliveryInfoDisplay(formData) {
  const addressInfo = document.querySelector('.delivery-info');
  if (addressInfo) {
    const rows = addressInfo.getElementsByTagName('tr');
    rows[0].getElementsByTagName('td')[1].textContent = formData.name;
    rows[1].getElementsByTagName('td')[1].textContent = formData.phone;
    rows[2].getElementsByTagName('td')[1].textContent = formData.address;
    rows[3].getElementsByTagName('td')[1].textContent = formData.detailAddress;
  }
}

// 배송요청사항 - 직접입력 선택 시 textarea visible
document.querySelector('.order-requirement-select').addEventListener('change', function(){
  const textarea = document.querySelector('textarea.order-requirement-select');

  if(this.value === '직접 입력') {
    textarea.hidden = false;
  } else{
    textarea.hidden = true;
  }
});

document.getElementById('requirement-use-next').addEventListener('change', async function() {
    const useNext = this.checked;
    const selectedRequirement = document.querySelector('.order-requirement-select');

    let requirementValue = '';
    if (useNext) {
        if (selectedRequirement.value === '직접 입력') {
            const inPerson = document.querySelector('textarea.order-requirement-select');
            inPerson.hidden = false;
            requirementValue = inPerson.value;
        } else {
            document.querySelector('textarea.order-requirement-select').hidden = true;
            requirementValue = selectedRequirement.value;
        }

        if (requirementValue) {
            try {
                const response = await fetch('/api/checkout/requirement/save', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: requirementValue
                });
                console.log('주문요청사항 저장 성공:', requirementValue);
            } catch (error) {
                console.error('주문요청사항 저장 실패:', error);
            }
        }
    }
});

// 저장된 배송요청사항 불러오기 함수
document.addEventListener('DOMContentLoaded', async function(){
  try{
    const response = await fetch('/api/checkout/requirement/get');
    if(!response.ok){
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }

    const requirement = await response.text();
    if(requirement){
      document.getElementById('requirement-use-next').checked=true;
      const selectBox = document.querySelector('.order-requirement-select');
      const option = Array.from(selectBox.options).some(option=>option.value === requirement);

      if(option) {
        selectBox.value = requirement;
      } else {
        selectBox.value = '직접 입력';
        const textarea = document.querySelector('textarea.order-requirement-select');
        textarea.value = requirement;
        textarea.hidden = false;
      }
    }
  } catch (error) {
    console.log('저장된 요청사항 없음');
  }
});

// 배송요청사항 변경 시 세션데이터 동기화
document.querySelector('.order-requirement-select').addEventListener('change', (e)=> {
  const requirement = e.target.value;
  const deliveryInfo = JSON.parse(sessionStorage.getItem('deliveryInfo'));
  const textarea = document.getElementById('input-in-person');

  if (requirement === '직접 입력') {
    textarea.hidden = false;
    deliveryInfo.requirement = textarea.value;
  } else {
    textarea.hidden = true;
    deliveryInfo.requirement = requirement;
  }

  console.log('배송요청사항 변경 : ', deliveryInfo.requirement);
  sessionStorage.setItem('deliveryInfo', JSON.stringify(deliveryInfo));
});

// textarea 값 변경 시
document.getElementById('input-in-person').addEventListener('input', (e)=> {
  const deliveryInfo = JSON.parse(sessionStorage.getItem('deliveryInfo'));
  deliveryInfo.requirement = e.target.value;
  sessionStorage.setItem('deliveryInfo', JSON.stringify(deliveryInfo));
});

// 주문상품정보 UI 업데이트
class OrderItemsManager {
    constructor() {
        this.ORDER_ITEMS_KEY = 'orderItems';
        this.CART_KEY = 'cart';
        this.DELIVERY_INFO_KEY = 'deliveryInfo';
        this.TOTAL_AMOUNT_KEY = 'totalAmount';
    }

    // 주문상품 데이터 가져오기
    getOrderItems() {
        const orderData = localStorage.getItem(this.ORDER_ITEMS_KEY);
        return orderData ? JSON.parse(orderData) : [];
    }

    // 주문상품 데이터 저장
    saveOrderItems(items) {
        localStorage.setItem(this.ORDER_ITEMS_KEY, JSON.stringify(items));
    }

    // 결제 취소 시 주문상품정보를 장바구니로 복원
    restoreCart() {
        const orderItems = this.getOrderItems();
        localStorage.setItem(this.CART_KEY, JSON.stringify(orderItems));
        localStorage.removeItem(this.ORDER_ITEMS_KEY); // 주문상품정보 제거
    }

    // 상품 개별 가격 계산
    calculateItemPrice(item) {
            const portion = item.selectedPortion === '1인분' ? 1 :
                           item.selectedPortion === '2인분' ? 2 :
                           item.selectedPortion === '4인분' ? 4 : 1;
            const basePrice = item.price * portion;

            // 할인율 적용
            let discountedPrice = basePrice;
            if (item.selectedPortion === '2인분') {
                discountedPrice = Math.round(basePrice * 0.97); // 3% 할인
            } else if (item.selectedPortion === '4인분') {
                discountedPrice = Math.round(basePrice * 0.93); // 7% 할인
            }

            return discountedPrice * item.quantity;
        }

    // 주문상품 UI 업데이트
    updateOrderItemsUI() {
        const orderItems = this.getOrderItems();
        const container = document.querySelector('#order-items-container');
        container.innerHTML = '';

        let totalPrice = 0;

        orderItems.forEach(item => {
            const itemPrice = this.calculateItemPrice(item);
            totalPrice += itemPrice;

            const itemElement = this.createOrderItemElement(item, itemPrice);
            container.appendChild(itemElement);
        });

        // 주문 정보 업데이트
        this.updateTotalPrice(totalPrice);

        // 결제 금액 업데이트 이벤트 발생
        this.triggerPriceUpdateEvent(totalPrice);
    }

    // 결제 금액 업데이트 이벤트 발생
    triggerPriceUpdateEvent(totalPrice) {
        const event = new CustomEvent('orderPriceUpdated', {
            detail: { totalPrice: totalPrice }
        });
        document.dispatchEvent(event);
    }

    // 합산가격 업데이트
    updateTotalPrice(totalPrice) {
        document.getElementById('order-item-total').textContent =
            `${totalPrice.toLocaleString()}원`;
        document.getElementById('order-total').textContent =
            `${totalPrice.toLocaleString()}원`;
        sessionStorage.setItem(this.TOTAL_AMOUNT_KEY, totalPrice);
    }

    // 주문상품 요소 생성
    createOrderItemElement(item, itemPrice) {
        const template = document.getElementById('order-item-container').content.cloneNode(true);

        // 이미지 설정
        template.querySelector('#order-item-image').src = item.image || item.imageUrl[0];

        // 카테고리 설정
        template.querySelector('#order-item-category').textContent = item.category;

        // 상품명 설정
        template.querySelector('#order-item-name').textContent = item.name;

        // 가격 정보 설정
        template.querySelector('#order-item-portion').textContent = item.selectedPortion;
        const portion = item.selectedPortion === '1인분' ? 1 :
                       item.selectedPortion === '2인분' ? 2 :
                       item.selectedPortion === '4인분' ? 4 : 1;
        const originalPrice = item.price * portion;
        template.querySelector('#order-item-price').textContent =
            `${originalPrice.toLocaleString()}원`;

        // 수량 설정
        const quantityField = template.querySelector('.quantity-field');
        quantityField.value = item.quantity;

        // 1회 제공량 버튼 활성화 상태 설정
         const portionButtons = template.querySelectorAll('.select-amount');
         portionButtons.forEach(button => {
             if (button.textContent === item.selectedPortion) {
                 button.classList.add('active');
             }
         });

        // 총 가격 설정 (할인 적용)
        const totalPriceElement = template.querySelector('#order-item-total-price');
        const originalPriceElement = totalPriceElement?.querySelector('.original-price');
        const discountRateElement = totalPriceElement?.querySelector('.discount-rate');
        const finalPriceElement = totalPriceElement?.querySelector('.final-price');

        if (item.selectedPortion !== '1인분') {
            // 2인분 또는 4인분일 경우 할인 적용
            const discountRate = item.selectedPortion === '2인분' ? '3%' : '7%';
            const discountedPrice = Math.round(originalPrice * (item.selectedPortion === '2인분' ? 0.97 : 0.93));

            const totalOriginalPrice = originalPrice * item.quantity;
            const totalDiscountedPrice = discountedPrice * item.quantity;

            if (originalPriceElement) {
                originalPriceElement.textContent = `${totalOriginalPrice.toLocaleString()}원`;
                originalPriceElement.style.display = 'block';
            }
            if (discountRateElement) {
                discountRateElement.textContent = `${discountRate} 할인`;
            }
            if (finalPriceElement) {
                finalPriceElement.textContent = ` ${totalDiscountedPrice.toLocaleString()}원`;
            }
        } else {
            // 1인분일 경우 할인 없음
            const totalPrice = originalPrice * item.quantity;
            if (originalPriceElement) {
                originalPriceElement.style.display = 'none';
            }
            if (discountRateElement) {
                discountRateElement.textContent = '';
            }
            if (finalPriceElement) {
                finalPriceElement.textContent = `${totalPrice.toLocaleString()}원`;
            }
        }

        // 이벤트 리스너 설정
        this.setupOrderItemEventListeners(template, item);

        return template;
    }

    // 주문상품 이벤트 리스너 설정
    setupOrderItemEventListeners(element, item) {
        // 삭제 버튼
        element.querySelector('#bin-icon').addEventListener('click', () => {
            this.removeOrderItem(item.id, item.selectedPortion);

        });

        // 수량 조절 버튼
        element.querySelectorAll('.order-quantity-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const action = e.target.value === '+' ? 'increase' : 'decrease';
                this.updateOrderItemQuantity(item.id, item.selectedPortion, action);
            });
        });

        // 1회 제공량 버튼
        element.querySelectorAll('.select-amount').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const newPortion = button.textContent;
                if (newPortion !== item.selectedPortion) {
                    const portionButtons = element.querySelectorAll('.select-amount');
                    portionButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                    this.updateOrderItemPortion(item.id, newPortion);
                }
            });
        });
    }

    // 상품 삭제
    removeOrderItem(itemId, selectedPortion) {
        const orderItems = this.getOrderItems();
        const updatedItems = orderItems.filter(item =>
            !(item.id === itemId && item.selectedPortion === selectedPortion)
        );
        this.saveOrderItems(updatedItems);
        this.updateOrderItemsUI();
    }

    // 수량 업데이트
    updateOrderItemQuantity(itemId, selectedPortion, action) {
        const orderItems = this.getOrderItems();
        const itemIndex = orderItems.findIndex(item =>
            item.id === itemId && item.selectedPortion === selectedPortion
        );

        if (itemIndex === -1) return;

        let newQuantity = orderItems[itemIndex].quantity;

        if (action === 'increase' && newQuantity < 10) {
            newQuantity++;
        } else if (action === 'decrease' && newQuantity > 1) {
            newQuantity--;
        }

        orderItems[itemIndex].quantity = newQuantity;
        this.saveOrderItems(orderItems);
        this.updateOrderItemsUI();
    }

    // 1회 제공량 업데이트
    updateOrderItemPortion(itemId, newPortion) {
        const orderItems = this.getOrderItems();
        const item = orderItems.find(item => item.id === itemId);

        if (!item) return;

        const currentPortion = item.selectedPortion;

        // 같은 상품의 다른 1회제공량이 이미 있는지 확인
        const existingItem = orderItems.find(i =>
            i.id === itemId && i.selectedPortion === newPortion
        );

        if (existingItem) {
            // 수량을 합치되 최대 10개를 넘지 않도록 함
            existingItem.quantity = Math.min(existingItem.quantity + item.quantity, 10);
            // 기존 아이템 제거
            const updatedItems = orderItems.filter(i =>
                !(i.id === itemId && i.selectedPortion === currentPortion)
            );
            this.saveOrderItems(updatedItems);
        } else {
            item.selectedPortion = newPortion;
            this.saveOrderItems(orderItems);
        }

        this.updateOrderItemsUI();
    }

    // 초기화 메서드
    init() {
        this.updateOrderItemsUI();

        // 주문상품 변경 시 관련 로직을 처리
        document.addEventListener('orderPriceUpdated', (event) => {
            console.log('총 주문 금액이 변경되었습니다.');
        });

         // 결제 취소 시 현재 주문상품정보 데이터를 로컬스토리지에 저장 후 홈화면
            document.querySelector('#cancel-pay-button').addEventListener('click', () => {
                this.restoreCart();
                
                window.location.href = '/';
            });
    }
}