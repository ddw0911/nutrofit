let isFirstRender = true;
let allProducts = [];

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
    clone.querySelector('.product-price').textContent = `${menu.price}원`;
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

// 카테고리 타이틀 로드
async function renderCategoryInfo(categoryInfo, containerId){

  const container = document.getElementById(containerId);
  const template = document.getElementById('category-title-template');

    container.innerHTML = '';

      const clone = template.content.cloneNode(true);

      // 데이터 바인딩
      try{
        clone.querySelector('#category-name').textContent= categoryInfo.category;
        clone.querySelector('#category-description').textContent = categoryInfo.categoryDescription;
        console.log('카테고리 데이터 바인딩 성공')
      } catch (error) {
        console.error('카테고리 데이터 바인딩 실패:', error)
      }
      container.appendChild(clone);
}

// 카테고리 메뉴 로드
async function loadCategoryMenu(category) {
  try {
    const response = await axios.get(`/menu/${category}`);
    console.log(`"${category}" 데이터 로드 완료:`, response.data);

    allProducts = response.data.special.concat(response.data.signature);
    console.log(allProducts);

    // 기존 데이터를 제거한 후 새 데이터 렌더링
    await renderCategoryInfo(response.data.categoryInfo, 'category-title');
    await renderCategoryMenu(response.data.special, 'specialMenuList');
    await renderCategoryMenu(response.data.signature, 'signatureMenuList');
  } catch (error) {
    console.error('메뉴 데이터를 불러오는 중 오류 발생:', error);
  }
}

// 제품 상세 정보를 모달에 렌더링 후 띄우는 함수
function viewProductDetailsModal(product) {
  // 모달 요소를 선택하고 데이터를 업데이트

  document.getElementById('product-preview-image').src = product.imageUrl[0];
  document.getElementById('product-preview-image').alt = `${product.name} 미리보기 이미지`;
  document.getElementById('product-compo-image').src = product.imageUrl[1];
  document.getElementById('product-compo-image').alt = `${product.name} 구성품 이미지`;
  document.getElementById('product-ingre-image').src = product.imageUrl[2];
  document.getElementById('product-ingre-image').alt = `${product.name} 재료 이미지`;

  document.getElementById('zoom-preview').style.backgroundImage = `url('${product.imageUrl[0]}')`;
  document.getElementById('zoom-compo').style.backgroundImage = `url('${product.imageUrl[1]}')`;
  document.getElementById('zoom-ingre').style.backgroundImage = `url('${product.imageUrl[2]}')`;

  document.getElementById('thumbnails-preview-image').src = product.imageUrl[0];
  document.getElementById('thumbnails-preview-image').alt = `${product.name} 미리보기 이미지`;
  document.getElementById('thumbnails-compo-image').src = product.imageUrl[1];
  document.getElementById('thumbnails-compo-image').alt = `${product.name} 구성품 이미지`;
  document.getElementById('thumbnails-ingre-image').src = product.imageUrl[2];
  document.getElementById('thumbnails-ingre-image').alt = `${product.name} 재료 이미지`;

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
  document.getElementById('modal-product-price').textContent = `${product.price}원`;
  document.getElementById('modal-product-compo').textContent = product.component;
  document.getElementById('modal-product-recipe').textContent = product.recipe;


  // 모달 띄우기
  const quickViewModal = new bootstrap.Modal(document.getElementById('quickViewModal'));
  quickViewModal.show();
}

// 모달 초기화
document.getElementById('quickViewModal').addEventListener('hidden.bs.modal', function () {
  // 백드롭 요소 제거
  const backdrop = document.querySelector('.modal-backdrop');
  if (backdrop) {
    backdrop.parentNode.removeChild(backdrop);
  }
  // body 스타일 초기화
  document.body.style.overflow = '';
});



// 제품 카드에서 상세 정보 보기를 클릭할 때
function openProductDetailsModal(button) {
  const productId = button.getAttribute('data-id');
  console.log(`제품번호 : ${productId}`);
  const product = allProducts.find(p => p.id === parseInt(productId));
  if (product) {
    viewProductDetailsModal(product);
    console.log(`${product} 제품 데이터 로드 성공`);
  } else{
    console.log(`${product} 제품 데이터 로드 실패`);
  }
}


// 초기 실행
document.addEventListener('DOMContentLoaded', () => {
  loadCategoryMenu('BALANCE'); // 초기 카테고리 로드
});