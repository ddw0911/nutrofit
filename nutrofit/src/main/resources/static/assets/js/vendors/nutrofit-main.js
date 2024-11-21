function addToCart() {
  const message = document.getElementById("cart-message");

  // 메시지 표시
  message.style.display = "block";

  setTimeout(() => {
    message.style.transform = "scale(1)";
    message.style.opacity = "1";
  }, 10);

  // 3초 후에 메시지 숨기기
  setTimeout(() => {
    message.style.display = "none";
  }, 3000);
}

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

//결제 동의 체크박스
document
  .getElementById("pay-button")
  .addEventListener("click", function (event) {
    const paymentCheckbox = document.getElementById("payment-agree-checkbox");

    if (!paymentCheckbox.checked) {
      // 체크되지 않은 경우 경고 메시지 표시
      alert("결제 내용을 확인하고 동의해 주세요.");

      // 기본 동작 취소 (페이지 이동 방지)
      event.preventDefault();
    } else {
      // 체크가 된 경우 결제 성공 모달 표시
      event.preventDefault(); // 기본 버튼 동작(폼 제출)을 방지하여 모달을 띄움
      const paymentSuccessModal = new bootstrap.Modal(
        document.getElementById("PaymentSuccessModal")
      );
      paymentSuccessModal.show();
    }
  });

// 결제 - 주문 요청사항 직접 입력 시 textarea visible
document
  .querySelector(".order-requirement-select")
  .addEventListener("change", function () {
    const textarea = document.querySelector(
      "textarea.order-requirement-select"
    );

    if (this.value === "직접 입력") {
      textarea.hidden = false;
    } else {
      textarea.hidden = true;
    }
  });
