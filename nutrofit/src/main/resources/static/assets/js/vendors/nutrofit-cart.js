// 장바구니 관리용 객체
const cartManager = {
  CART_KEY: 'cart',

  isUserLoggedIn() {
      const isLoggedIn = document.body.getAttribute('data-user-logged-in') === 'true';
      console.log('로그인 상태 체크:', isLoggedIn);
      return isLoggedIn;
  },

  getMemberId() {
          if (!this.isUserLoggedIn()) {
              return null;
          }
          const memberId = document.body.getAttribute('data-member-id');
          return memberId ? parseInt(memberId) : null;
      },

  // 장바구니 데이터 가져오기
  getCart() {
    try {
      return JSON.parse(localStorage.getItem(this.CART_KEY)) || [];
    } catch (error) {
      console.error('장바구니 데이터 파싱 실패:', error);
      return [];
    }
  },

// 장바구니 데이터 저장
  saveCart(cart) {
    try {
      localStorage.setItem(this.CART_KEY, JSON.stringify(cart));
      this.updateCartCount();

      if (this.isUserLoggedIn()) {
        // 로그인 상태일 때만 서버와 동기화
        this.syncCartWithServer();
      } else {
        console.log('비로그인 상태: 로컬에만 저장됨');
      }
    } catch (error) {
      console.error('장바구니 저장 실패:', error);
    }
  },

  // 상품 추가
  addItem(product) {
    console.log(product);
    const cart = this.getCart();
    console.log(cart);

    const quantity = parseInt(document.querySelector('.quantity-field').value) || 1;
    const selectedPortion = document.querySelector('.portion-btn.active')?.textContent || '1인분';

    const existingItemIndex = cart.findIndex(
        item => item.id === product.id && item.selectedPortion === selectedPortion
    );

    if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += quantity;
    } else {
        cart.push({
            ...product,
            quantity: quantity,
            selectedPortion: selectedPortion
        });
    }

    this.saveCart(cart);
    this.showCartMessage();
  },

  // 장바구니 아이콘 숫자 업데이트
  updateCartCount() {
    const cart = this.getCart(); // 장바구니 데이터를 가져옵니다.
        const totalItems = cart.length;
        const badges = document.querySelectorAll('#cart-badge, #float-cart-badge');
        badges.forEach(badge => {
            if (totalItems > 0) {
                badge.style.display = 'block';
                badge.textContent = totalItems;
            } else {
                badge.style.display = 'none';
            }
        })
  },

  // 장바구니 담기 성공 메시지 (기존 코드 활용)
  showCartMessage() {
    const message = document.getElementById('cart-message');
    message.style.display = 'block';

    // 애니메이션 효과 추가
    setTimeout(() => {
      message.style.transform = 'scale(1)';
      message.style.opacity = '1';
    }, 10);

    // 3초 후 메시지 숨기기
    setTimeout(() => {
      message.style.opacity = '0';
      message.style.transform = 'scale(0.8)';
      setTimeout(() => {
        message.style.display = 'none';
      }, 300);
    }, 3000);
  },

  // 전체 장바구니 서버 동기화
  syncCartWithServer() {
    console.log('syncCartWithServer 시작');
    if (!this.isUserLoggedIn()) {
        console.log('비로그인 상태: 서버 동기화 중단');
        return;
    }
        const memberId = this.getMemberId();
        if(!memberId) {
          console.error("memberId not founded");
          return;
        }

            const cart = this.getCart();
            // 빈 장바구니 체크 추가
            if (!cart || cart.length === 0) {
                console.log('장바구니가 비어있음');
                return;
            }

        console.log(memberId," 장바구니 동기화 시도")

    const serverCartItems = cart.map(item => ({
         productId: item.id,          // 제품ID (product_id)
         memberId: memberId,
         quantity: parseInt(item.quantity),      // 수량 (quantity)
         portion: item.selectedPortion === '1인분' ? 'ONE' :
                  item.selectedPortion === '2인분' ? 'TWO' : 'FOUR',
         discount: item.selectedPortion === '2인분' ? 'THREE_PER' :
                   item.selectedPortion === '4인분' ? 'SEVEN_PER' : 'NONE',
         total: this.calculateItemPrice(item), // 총 가격 (total),
         regDate: this.getCurrentTime()
    }));
    console.log('서버로 전송되는 데이터:', serverCartItems);

    fetch('/api/cart/sync', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(serverCartItems),
    })
     .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(text);
                });
            }
            console.log('장바구니 동기화 완료');
            this.updateCartUI();  // UI 업데이트 추가
        })
        .catch(error => {
            console.error('서버 통신 오류:', error);
        });
  },

  // 현재 시간을 ISO 형식 문자열로 반환
  getCurrentTime() {
      const now = new Date();
      return now.toISOString();
  },

  // 가격 계산
    calculateItemPrice(item) {
      let portionMultiplier = 1;
      let discount = 0;

      if (item.selectedPortion === '2인분') {
        portionMultiplier = 2;
        discount = 0.03;
      } else if (item.selectedPortion === '4인분') {
        portionMultiplier = 4;
        discount = 0.07;
      }

      const originalPrice = item.price * portionMultiplier * item.quantity;
      return Math.floor(originalPrice * (1 - discount));
    },

    // 장바구니 UI 업데이트
    updateCartUI() {
      const cart = this.getCart();
      const container = document.querySelector('.list-group');
      container.innerHTML = ''; // 기존 내용 비우기

      if (cart.length === 0) {
        container.innerHTML = '<li class="list-group-item py-3 ps-0">장바구니가 비어있습니다.</li>';
        document.querySelector('.cart-total-price').textContent = '합계 : 0원';
        return;
      }

      let totalPrice = 0;

      cart.forEach(item => {
        const itemPrice = this.calculateItemPrice(item);
        totalPrice += itemPrice;

        const itemElement = this.createCartItemElement(item, itemPrice);
        container.appendChild(itemElement);
      });

      // 총 합계 금액 업데이트
      document.querySelector('.cart-total-price').textContent =
        `합계 : ${totalPrice.toLocaleString()}원`;
    },

    // 장바구니 아이템 요소 생성
    createCartItemElement(item, itemPrice) {

      console.log('장바구니 상품 : ', item);
      const template = document.getElementById('cart-item-container').content.cloneNode(true);

      // 이미지 설정
      template.querySelector('.cart-item-image').src = item.image || item.imageUrl[0];

      // 상품명 설정
      template.querySelector('.cart-item-name').textContent = item.name;

      // 가격 정보 설정
      template.querySelector('.cart-item-portion').textContent = item.selectedPortion;
      const portion = item.selectedPortion === '1인분' ? 1 :
                      item.selectedPortion === '2인분' ? 2 :
                      item.selectedPortion === '4인분' ? 4 : 1;
      const originalPrice = item.price * portion;
      template.querySelector('.cart-item-price').textContent =
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

      // 품목별 총 가격
      template.querySelector('.cart-item-total-price').textContent =
        `${itemPrice.toLocaleString()}원`;

      // 이벤트 리스너 설정
      this.setupCartItemEventListeners(template, item);

      return template;
    },

    // 장바구니 아이템 이벤트 리스너 설정
    setupCartItemEventListeners(element, item) {
      // 삭제 버튼
      element.querySelector('.text-decoration-none').addEventListener('click', () => {
        this.removeItem(item.id, item.selectedPortion);
      });

      // 수량 조절 버튼
      element.querySelectorAll('.cart-quantity-btn').forEach(button => {
        button.addEventListener('click', (e) => {
          const action = e.target.value === '+' ? 'increase' : 'decrease';
          this.updateQuantity(item.id, item.selectedPortion, action);
        });
      });

      // 1회 제공량 버튼
      element.querySelectorAll('.select-amount').forEach(button => {
        button.addEventListener('click', () => {
          this.updatePortion(item.id, button.textContent);
        });
      });
    },

    // 상품 삭제
    removeItem(itemId, selectedPortion) {
      const cart = this.getCart();
      const updatedCart = cart.filter(item =>
        !(item.id === itemId && item.selectedPortion === selectedPortion)
      );
      this.saveCart(updatedCart);
      this.updateCartUI();
    },

    // 수량 업데이트
    updateQuantity(itemId, selectedPortion, action) {
        const cart = this.getCart();
        const itemIndex = cart.findIndex(item =>
            item.id === itemId && item.selectedPortion === selectedPortion
        );

        if (itemIndex === -1) return;

        let newQuantity = cart[itemIndex].quantity;

        if (action === 'increase' && newQuantity < 10) {
            newQuantity++;
        } else if (action === 'decrease' && newQuantity > 1) {
            newQuantity--;
        }

        cart[itemIndex].quantity = newQuantity;
        this.saveCart(cart);
        this.updateCartUI();
    },

    // 1회 제공량 업데이트
    updatePortion(itemId, newPortion) {
        const cart = this.getCart();
        const item = cart.find(item => item.id === itemId);

        if (!item) return;

        item.selectedPortion = newPortion;
        this.saveCart(cart);
        this.updateCartUI();  // 여기서 전체 UI를 다시 그림
    }
};

// 슬라이더에서 간편 담기 (+ 버튼)
function quickAddToCart(button) {
  const productId = button.closest('.card-product').querySelector('.btn-action').getAttribute('data-id');
  const product = productManager.findProduct(parseInt(productId));

  if (!product || !product.id) {
          console.error('상품을 찾을 수 없음:', productId);
          return;
      }

      console.log('간편 담기 상품:', product);
      cartManager.addItem(product);
}

// 장바구니 담기 버튼 클릭 이벤트 핸들러
function addToCart() {
  if (!window.currentProduct || !window.currentProduct.id) {
          console.error('유효하지 않은 상품 정보');
          return;
      }

      const product = {
          id: window.currentProduct.id,          // id 명시적 지정
          price: window.currentProduct.price,
          name: window.currentProduct.name,
          image: window.currentProduct.image,
          quantity: window.currentProduct.quantity || 1,
          selectedPortion: window.currentProduct.selectedPortion || '1인분'
      };

      cartManager.addItem(product);
}

// 장바구니 열릴 때 UI 업데이트
document.getElementById('offcanvasRight').addEventListener('show.bs.offcanvas', () => {
  cartManager.updateCartUI();
});

// 페이지 로드시 장바구니 카운트 초기화
document.addEventListener('DOMContentLoaded', () => {
  cartManager.updateCartCount();
});

//모달 종료 시 데이터 초기화
document.getElementById('quickViewModal').addEventListener('hidden.bs.modal', () => {
  console.log('모달 종료: 모든 데이터 초기화');

  const backdrop = document.querySelector('.modal-backdrop');
  if (backdrop) {
      backdrop.parentNode.removeChild(backdrop);
  }

  document.body.classList.remove('modal-open');
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';

  // 초기 상태로 리셋
  window.currentProduct = {
    selectedPortion: '1인분',
    quantity: 1
  };

  const quantityInput = document.querySelector('.quantity-field');
  if (quantityInput) {
    quantityInput.value = 1;
  }

  document.querySelectorAll('.portion-btn').forEach(button => button.classList.remove('active'));

  // currentProduct가 존재할 때만 updateTotalPrice 호출
  if (window.currentProduct) {
    updateTotalPrice();
  }
});

document.getElementById('proceed-checkout').addEventListener('click', () =>{
  window.location.href = '/checkout/shop';
});