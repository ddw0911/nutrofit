function scrollToTop() {
  const scrollDuration = 200; // 스크롤이 완료되는 데 걸리는 시간 (밀리초)
  const startPosition = window.scrollY;
  const startTime = performance.now();

  function animateScroll(currentTime) {
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / scrollDuration, 1); // 최대 1까지
    const easeProgress = progress * (2 - progress); // ease-out 효과

    window.scrollTo(0, startPosition * (1 - easeProgress));

    if (progress < 1) {
      requestAnimationFrame(animateScroll); // 다음 프레임 요청
    }
  }

  requestAnimationFrame(animateScroll); // 애니메이션 시작
}

function scrollToItemList() {
  const targetElement = document.getElementById("item-list");
  const targetPosition =
    targetElement.getBoundingClientRect().top + window.scrollY;
  const startPosition = window.scrollY;
  const scrollDuration = 200; // 스크롤이 완료되는 데 걸리는 시간 (밀리초)
  const startTime = performance.now();

  function animateScroll(currentTime) {
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / scrollDuration, 1); // 최대 1까지
    const easeProgress = progress * (2 - progress); // ease-out 효과

    window.scrollTo(
      0,
      startPosition + (targetPosition - startPosition) * easeProgress
    );

    if (progress < 1) {
      requestAnimationFrame(animateScroll); // 다음 프레임 요청
    }
  }

  requestAnimationFrame(animateScroll); // 애니메이션 시작
}

// 로그인 시 세션스토리지에 회원정보 저장
  document.addEventListener("DOMContentLoaded", function() {
        const isLoggedIn = document.body.getAttribute('data-user-logged-in') === 'true';

        if (isLoggedIn) {
            const member = document.body.getAttribute('data-member');
            if (member) {
                localStorage.setItem("member", member);
            }
        } else {
            // 로그아웃할 때 로컬스토리지에서 제거
            localStorage.removeItem("member");
        }
  });