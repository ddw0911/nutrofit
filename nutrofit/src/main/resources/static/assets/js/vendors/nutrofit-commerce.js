let isFirstRender = true;

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

    // 기존 데이터를 제거한 후 새 데이터 렌더링
    await renderCategoryInfo(response.data.categoryInfo, 'category-title');
    await renderCategoryMenu(response.data.special, 'specialMenuList');
    await renderCategoryMenu(response.data.signature, 'signatureMenuList');
  } catch (error) {
    console.error('메뉴 데이터를 불러오는 중 오류 발생:', error);
  }
}

// 초기 실행
document.addEventListener('DOMContentLoaded', () => {
  loadCategoryMenu('BALANCE'); // 초기 카테고리 로드
});