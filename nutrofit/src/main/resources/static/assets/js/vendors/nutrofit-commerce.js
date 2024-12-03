// 초기 실행 변수
let isFirstRender = true;

const productManager = {
  products: [],

  setProducts(products) {
    this.products = products;
    window.allProducts = products;
  },

  findProduct(productId) {
    return this.products.find(p => p.id === parseInt(productId));
  }
};

// 초기 실행
document.addEventListener('DOMContentLoaded', async () => {
  // 회원가입 시 선택한 사항(관심카테고리, 1회제공량)에 맞춰 화면 렌더링
  try {
    const response = await fetch("/api/member/category");
    const category = await response.json();

    if(category) {
      loadCategoryMenu(category); // 회원가입 시 선택한 카테고리 로드
    } else {
      loadCategoryMenu('BALANCE'); // 없을 시 밸런스식단(default) 로드
    }

    // 장바구니 추가 버튼 이벤트 리스너 설정
    const addToCartButton = document.getElementById('add-to-cart-button');
    if (addToCartButton) {
      addToCartButton.addEventListener('click', () => {
        addToCart(); // 장바구니에 제품 추가
        // 필요한 경우 모달 닫기
        const quickViewModal = bootstrap.Modal.getInstance(document.getElementById('quickViewModal'));
        if (quickViewModal) {
          quickViewModal.hide();
        }
      });
    }
  } catch (error) {
    console.error('Error:', error);
    loadCategoryMenu('BALANCE'); // 에러 발생시에도 기본값 로드
  }
});

// 상품소개 카드 클릭 시 화면 이동 후 카테고리 드롭다운
function chooseCategory(category) {
  const sidebar = document.getElementById(category); // ID로 해당 사이드바 요소 찾기
  const targetId = sidebar.getAttribute('data-bs-target'); // 데이터 속성으로 대상 ID 찾기
  const collapseTarget = document.querySelector(targetId); // 대상 ID를 통해 실제 요소 찾기
  const isExpanded = sidebar.getAttribute('aria-expanded') === 'true';

  // 토글 처리
  if (!isExpanded) {
    collapseTarget.classList.add('show'); // 드롭다운 열기
    sidebar.setAttribute('aria-expanded', 'true');
  } else {
    collapseTarget.classList.remove('show'); // 드롭다운 닫기
    sidebar.setAttribute('aria-expanded', 'false');
  }
}

// 카테고리 메뉴 로드
async function loadCategoryMenu(category) {
  try {
    const response = await axios.get(`/menu/${category}`);
    console.log(`"${category}" 데이터 로드 완료:`, response.data);

    productManager.setProducts(response.data.special.concat(response.data.signature));
    console.log(allProducts);

    // 기존 데이터를 제거한 후 새 데이터 렌더링
    await renderCategoryInfo(response.data.categoryInfo, 'category-title');
    await renderCategoryMenu(response.data.special, 'specialMenuList');
    await renderCategoryMenu(response.data.signature, 'signatureMenuList');
  } catch (error) {
    console.error('메뉴 데이터를 불러오는 중 오류 발생:', error);
  }
}

// 카테고리 타이틀 로드
async function renderCategoryInfo(categoryInfo, containerId) {
  const container = document.getElementById(containerId);
  const template = document.getElementById('category-title-template');

  container.innerHTML = '';

  const clone = template.content.cloneNode(true);

  // 데이터 바인딩
  try {
    clone.querySelector('#category-name').textContent = categoryInfo.category;
    clone.querySelector('#category-description').textContent = categoryInfo.categoryDescription;
    console.log('카테고리 데이터 바인딩 성공');
  } catch (error) {
    console.error('카테고리 데이터 바인딩 실패:', error);
  }
  container.appendChild(clone);
}

// 메뉴 렌더링
async function renderCategoryMenu(menuType, containerId) {
  const container = document.getElementById(containerId);
  const template = document.getElementById('menuSlider');

  // 첫 화면이 아니면 슬라이더 제거
  if (!isFirstRender && $(container).hasClass('slick-initialized')) {
    $(container).slick('unslick');
    console.log(`${containerId} 기존 슬라이더 제거 완료`);
  }

  container.innerHTML = '';

  // 새 컨테이너에 데이터 렌더링
  menuType.forEach((menu) => {
    const clone = template.content.cloneNode(true);

    // 데이터 바인딩
    const badgeContainer = clone.querySelector('.badge-container');
    const badgeText = clone.querySelector('.product-popularity');
    if (menu.popularity) {
      badgeContainer.style.display = 'block';
      badgeText.textContent = menu.popularity;
      badgeText.classList.add(menu.popularity === 'HOT' ? 'bg-danger' : 'bg-primary');
    }

    const imageUrl = menu.imageUrl && menu.imageUrl.length ? menu.imageUrl[0] : 'default.jpg';
    clone.querySelector('.product-image').src = imageUrl;
    clone.querySelector('.product-image').alt = `${menu.name}.jpg`;
    clone.querySelector('.product-name').textContent = menu.name;
    clone.querySelector('.product-price').textContent = `${menu.price.toLocaleString()}원`;
    clone.querySelector('.product-category').textContent = menu.category;
    clone.querySelector('.btn-action').setAttribute('data-id', menu.id); // 제품 ID 설정

    container.appendChild(clone);
  });

  // 이미지 로드 대기
  await Promise.all(
    [...container.querySelectorAll('.product-image')].map((img) => {
      return new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
      });
    })
  );

  // 슬라이더 초기화
  await initializeSlider(containerId);
  isFirstRender = false;
}

// 슬라이더 초기화
async function initializeSlider(containerId) {
  const $slider = $(`#${containerId}`);

  // 기존 슬라이더 초기화 제거
  if ($slider.hasClass('slick-initialized')) {
    $slider.slick('unslick');
    console.log(`${containerId} 슬라이더 초기화 제거 완료`);
  }

  // 슬라이더 재초기화
  $slider.slick({
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    dots: false,
    arrows: true,
    prevArrow: '<button class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-left"><polyline points="15 18 9 12 15 6"></polyline></svg></button>',
    nextArrow: '<button class="slick-next"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-right"><polyline points="9 18 15 12 9 6"></polyline></svg></button>',
    responsive: [
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 820,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  });
}

// 제품 카드에서 상세 정보 보기를 클릭할 때
function openProductDetailsModal(button) {
  const productId = button.getAttribute('data-id');
  console.log(`제품번호 : ${productId}`);
  const product = allProducts.find(p => p.id === parseInt(productId));
  if (product) {
    viewProductDetailsModal(product);
    console.log(`${product.name} 제품 데이터 로드 성공`);
  } else {
    console.log(`제품 데이터 로드 실패`);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  // 이미지 엘리먼트 가져오기
  const ingreImage = document.getElementById('thumbnails-ingre-image');
  const ingreZoom = document.getElementById('zoom-ingre');

  // src 속성이 비어 있거나 null인지 확인
  if (!ingreImage.src || ingreImage.src === "") {
    // 부모 요소 숨기기
    ingreImage.parentElement.style.display = 'none';
    ingreZoom.style.display = 'none';
  }
});

// 제품상세 정보 렌더링
function viewProductDetailsModal(product) {
  const imageContainer = document.getElementById('productModal');
  const thumbnailsContainer = document.getElementById('productModalThumbnails');

  // 기존의 이미지를 모두 제거합니다.
  imageContainer.innerHTML = '';
  thumbnailsContainer.innerHTML = '';

  // 이미지 요소 생성
  const mainImageElement = document.createElement('img');
  mainImageElement.id = 'product-main-image';
  mainImageElement.src = product.imageUrl[0];
  mainImageElement.style.height = '525px'; // 고정된 높이
  mainImageElement.style.width = 'auto'; // 비율에 맞게 자동 조정
  mainImageElement.style.transition = 'opacity 0.5s ease'; // 트랜지션 효과 추가
  mainImageElement.style.objectFit = 'contain';
  mainImageElement.style.borderRadius = '0.5rem';
  imageContainer.appendChild(mainImageElement);

  // 현재 표시 중인 이미지의 인덱스를 저장
  let currentImageIndex = 0;

  // 썸네일 이미지 생성 함수
  const createThumbnail = (src, id, index) => {
    const col = document.createElement('div');
    col.classList.add('col-3');
    const thumbnailDiv = document.createElement('div');
    thumbnailDiv.classList.add('thumbnails-img');
    const thumbnailImg = document.createElement('img');
    thumbnailImg.id = id;
    thumbnailImg.src = src;

    thumbnailImg.onclick = function () {
      // 현재 표시 중인 이미지와 선택한 이미지가 다를 때만 작동
      if (currentImageIndex !== index) {
        currentImageIndex = index;

        // 페이드 아웃 효과
        mainImageElement.style.opacity = '0';
        setTimeout(() => {
          // 이미지 변경 및 페이드 인 효과
          mainImageElement.src = src;
          mainImageElement.style.opacity = '1';
        }, 200); // 0.5초 후 이미지 변경
      }
    };

    thumbnailDiv.appendChild(thumbnailImg);
    col.appendChild(thumbnailDiv);
    thumbnailsContainer.appendChild(col);
  };

  // 썸네일 생성
  product.imageUrl.forEach((imageUrl, index) => {
    createThumbnail(imageUrl, `thumbnails-image-${index}`, index);
  });

  // 영양 성분 및 제품 정보 업데이트
  document.getElementById('calories').textContent = `${product.nutrition.calories} kcal`;
  document.getElementById('carbo').textContent = `${product.nutrition.carbo} g`;
  document.getElementById('protein').textContent = `${product.nutrition.protein} g`;
  document.getElementById('saturatedFat').textContent = `${product.nutrition.saturatedFat} g`;
  document.getElementById('transFat').textContent = `${product.nutrition.transFat} g`;
  document.getElementById('cholesterol').textContent = `${product.nutrition.cholesterol} mg`;
  document.getElementById('sodium').textContent = `${product.nutrition.sodium} mg`;

  document.getElementById('modal-product-category').textContent = product.category;
  document.getElementById('modal-product-name').textContent = product.name;
  document.getElementById('modal-product-description').textContent = product.description;
  document.getElementById('modal-product-compo').textContent = product.component;
  document.getElementById('modal-product-recipe').textContent = product.recipe;

  window.currentProduct = {
    id: product.id,
    price: product.price,
    name: product.name,
    image : product.imageUrl[0],
    selectedPortion: '1인분',
    quantity: 1
  };

  // 수량 초기값 설정
  window.currentProduct.quantity = 1;

  // 모달 띄우기
  const quickViewModal = new bootstrap.Modal(document.getElementById('quickViewModal'));
  quickViewModal.show();

  updateTotalPrice();
}


// 제공량 버튼 클릭 이벤트 설정
document.querySelectorAll('.portion-btn').forEach(button => {
  button.addEventListener('click', (event) => {
    const selectedPortion = event.target.textContent.trim();
    console.log(`제공량 선택 : ${selectedPortion}`);

    // 모든 버튼의 active 상태 제거 후 현재 버튼에 active 추가
    document.querySelectorAll('.portion-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // 선택된 인분의 값 저장
    window.currentProduct.selectedPortion = selectedPortion;

    // 총 가격 업데이트
    updateTotalPrice();
  });
});

// 모달이 표시될 때 수량 조절 버튼 이벤트 리스너 추가
document.getElementById('quickViewModal').addEventListener('shown.bs.modal', () => {
  const modal = document.getElementById('quickViewModal');
  const quantityDisplay = modal.querySelector('.quantity-field');
  quantityDisplay.value = window.currentProduct.quantity; // 기본 수량을 설정

  // 수량 조절 버튼 클릭 이벤트 설정
  modal.querySelectorAll('.button-minus, .button-plus').forEach(button => {
    // 기존 이벤트 리스너 제거 (중복 방지)
    button.removeEventListener('click', handleQuantityChange);
    // 새로운 이벤트 리스너 추가
    button.addEventListener('click', handleQuantityChange);
  });

  // 수량 입력 필드 변경 이벤트 설정
  // 기존 이벤트 리스너 제거 (중복 방지)
  quantityDisplay.removeEventListener('input', handleQuantityInput);
  // 새로운 이벤트 리스너 추가
  quantityDisplay.addEventListener('input', handleQuantityInput);
});

// 수량 조절 버튼 클릭 이벤트 핸들러
function handleQuantityChange(event) {
  const modal = document.getElementById('quickViewModal');
  const quantityDisplay = modal.querySelector('.quantity-field');
  let quantity = parseInt(quantityDisplay.value) || 1;

  if (event.target.classList.contains('button-plus')) {
    if (quantity < 10) {
      quantity++;
    }
  } else if (event.target.classList.contains('button-minus')) {
    if (quantity > 1) {
      quantity--;
    }
  }

  // 수량 상태 업데이트 및 화면에 반영
  quantityDisplay.value = quantity;

  // window.currentProduct.quantity 업데이트
  window.currentProduct.quantity = quantity;

  // 총 가격 업데이트
  updateTotalPrice();

  // 현재 입력 필드의 값 확인 로그
  console.log(`현재 입력된 수량 값: ${quantity}`);
}

// 수량 입력 필드 변경 이벤트 핸들러
function handleQuantityInput(event) {
  const modal = document.getElementById('quickViewModal');
  const quantityDisplay = modal.querySelector('.quantity-field');
  let quantity = parseInt(quantityDisplay.value) || 1;
  if (quantity > 10) quantity = 10;
  if (quantity < 1) quantity = 1;

  quantityDisplay.value = quantity;
  window.currentProduct.quantity = quantity;
  updateTotalPrice();

  console.log(`현재 입력된 수량 값: ${quantity}`);
}

// 총 가격 계산 함수
function updateTotalPrice() {
  const price = window.currentProduct.price;
  const selectedPortion = window.currentProduct.selectedPortion || '1인분';
  const quantity = window.currentProduct.quantity;

  let portion = 1;
  let discount = 0;
  const originalPriceElement = document.getElementById('modal-original-price');

  // 인분 수에 따른 승수와 할인율 설정
  if (selectedPortion === '2인분') {
    portion = 2;
    discount = 0.03; // 3% 할인
  } else if (selectedPortion === '4인분') {
    portion = 4;
    discount = 0.07; // 7% 할인
  }

  // 원래 가격 계산 (할인 전)
  const originalPrice = price * portion * quantity;
  // 할인된 가격 계산
  const discountedPrice = Math.floor(originalPrice * (1 - discount));

  // 최종 계산된 데이터를 window.currentProduct에 저장
  window.currentProduct.finalPrice = discountedPrice; // 최종 가격
  window.currentProduct.selectedPortion = selectedPortion;
  window.currentProduct.originalPrice = originalPrice; // 원래 가격
  window.currentProduct.discount = discount; // 할인율
  console.log(currentProduct);

  // 1인분 선택시 원래 가격 숨기기
  if (discount > 0) {
    originalPriceElement.style.display = 'block';
    originalPriceElement.textContent = `${originalPrice.toLocaleString()}원`;
  } else {
    originalPriceElement.style.display = 'none';
  }

  // 최종 가격 표시
  document.getElementById('modal-product-price').textContent =
    `${discountedPrice.toLocaleString()}원`;
}



