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

  // 로그인 시 서버-장바구니 동기화
  syncCartWithServer() {
    console.log('syncCartWithServer 시작');
    if (!this.isUserLoggedIn()) {
        console.log('비로그인 상태: 서버 동기화 중단');
        return;
    }
        const memberId = this.getMemberId();
        console.log("로그인 사용자 id:", memberId);
        if(!memberId) {
          console.error("member not founded");
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
         productId: item.id,
         memberId: memberId,
         quantity: parseInt(item.quantity),      // 수량 (quantity)
         portion: item.selectedPortion === '1인분' ? 'ONE' :
                  item.selectedPortion === '2인분' ? 'TWO' : 'FOUR',
         discount: item.selectedPortion === '2인분' ? '3%' :
                   item.selectedPortion === '4인분' ? '7%' : 'NONE',
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

    async removeItem(itemId, selectedPortion) {
        // 로컬 장바구니에서 삭제
        const cart = this.getCart();
        const updatedCart = cart.filter(item =>
            !(item.id === itemId && item.selectedPortion === selectedPortion)
        );

        // 로그인한 사용자인 경우 서버에서도 삭제
        if (this.isUserLoggedIn()) {
            const memberId = this.getMemberId();
            const portion = selectedPortion === '1인분' ? 'ONE' :
                               selectedPortion === '2인분' ? 'TWO' : 'FOUR';
            try {
                const response = await fetch(`/api/cart/${memberId}/delete/${itemId}/${portion}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('서버에서 상품 삭제 실패');
                }
                console.log('서버에서 상품 삭제 완료');
            } catch (error) {
                console.error('서버 통신 오류:', error);
            }
        }

        // 로컬 장바구니 업데이트 및 UI 갱신
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

// 1회 제공량 옵션 업데이트 시
  async updatePortion(itemId, newPortion) {
    const cart = this.getCart();
    const oldItem = cart.find(item => item.id === itemId);

    if (!oldItem) return;

    // 1. 기존 항목 삭제 (서버)
    if (this.isUserLoggedIn()) {
        const memberId = this.getMemberId();
        const oldPortion = oldItem.selectedPortion === '1인분' ? 'ONE' :
                          oldItem.selectedPortion === '2인분' ? 'TWO' : 'FOUR';
        try {
            await fetch(`/api/cart/${memberId}/delete/${itemId}/${oldPortion}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } catch (error) {
            console.error('서버에서 기존 항목 삭제 실패:', error);
            return;
        }
    }

    // 2. 새로운 항목으로 업데이트
    oldItem.selectedPortion = newPortion;
    this.saveCart(cart);  // 이 메서드에서 서버 동기화(syncCartWithServer)도 처리됨
    this.updateCartUI();
  }
};

// 슬라이더에서 간편 담기 (+ 버튼)
function quickAddToCart(button) {
  const productId = button.closest('.card-product').querySelector('.btn-action').getAttribute('data-id');
  const product = productManager.findProduct(parseInt(productId));

  if (product) {
    cartManager.addItem(product);
  }
}

// 장바구니 담기 버튼 클릭 이벤트 핸들러
function addToCart() {
  const product = {
    ...window.currentProduct
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



// 모달이 닫힐 때 데이터 초기화
document.getElementById('quickViewModal').addEventListener('hidden.bs.modal', () => {
  console.log('모달 종료: 모든 데이터 초기화');

  const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
          backdrop.parentNode.removeChild(backdrop);
      }

  document.body.classList.remove('modal-open');
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';

  window.currentProduct = null;

  const quantityInput = document.querySelector('.quantity-field');
  quantityInput.value = 1;

  document.querySelectorAll('.portion-btn').forEach(button => button.classList.remove('active'));
  window.currentProduct.selectedPortion = '1인분';

  updateTotalPrice();
});

// 주문하러 가기 버튼 클릭 시
document.getElementById('proceed-checkout').addEventListener('click', async () =>{
  try {
          const response = await fetch('/api/member/status');
          const isLoggedIn = await response.json();
          const cart = JSON.parse(localStorage.getItem('cart'));

          if (isLoggedIn) {
            if(cart.length===0){
              alert("결제할 상품이 없습니다.");
            } else {
              window.location.href = '/checkout/shop';
            }
          } else {
              alert("로그인이 필요한 서비스입니다. 로그인 화면으로 이동합니다.");
              window.location.href = '/signin';
          }
      } catch (error) {
          console.error('인증 상태 확인 중 오류 발생:', error);
          alert("일시적인 오류가 발생했습니다. 다시 시도해주세요.");
      }
});