// 카카오 주소찾기 api
function searchAddress() {
   new daum.Postcode({
       oncomplete: function(data) {
           document.getElementById('address').value = data.address;
           document.getElementById('detailAddress').focus();
       }
   }).open();
}

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

// UI 업데이트 함수
function updateDeliveryInfoDisplay(formData) {
  const addressInfo = document.querySelector('.address-info');
  if (addressInfo) {
    const rows = addressInfo.getElementsByTagName('tr');
    rows[0].getElementsByTagName('td')[1].textContent = formData.name;
    rows[1].getElementsByTagName('td')[1].textContent = formData.phone;
    rows[2].getElementsByTagName('td')[1].textContent = formData.address;
    rows[3].getElementsByTagName('td')[1].textContent = formData.detailAddress;
  }
}

// 저장된('다음에도 사용' 체크한) 배송요청사항 불러오기 함수
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

// 배송요청사항 등록 함수
document.getElementById('delivery-requirement-to-next').addEventListener('click', async function(){
  const useNext = document.getElementById('requirement-use-next').checked;
  const selectedRequirement = document.querySelector('.order-requirement-select');

  let requirementValue='';
  if (useNext) {
    if(selectedRequirement.value === '직접 입력'){
      const inPerson = document.querySelector('textarea.order-requirement-select');
      inPerson.hidden=false;
      requirementValue = inPerson.value;
    } else {
      document.querySelector('textarea.order-requirement-select').hidden = true;
      requirementValue = selectedRequirement.value;
    }
  }

  // 다음에도 사용 체크 시 서버에 저장
  if(useNext && requirementValue) {
    try{
      const response = await fetch('/api/checkout/requirement/save',{
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: requirementValue
      });
      console.log('주문요청사항 저장 성공')
    } catch (error) {
      console.error('주문요청사항 저장 실패:', error);
    }
  }
});

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

// 주문 요청사항 직접 입력 시 textarea visible
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


