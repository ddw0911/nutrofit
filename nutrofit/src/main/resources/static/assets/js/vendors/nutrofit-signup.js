// 회원가입 - 이메일 중복확인
function checkEmailDuplicated() {
    const emailInput = document.getElementById("emailInput");
    const resultMessage = emailInput.nextElementSibling || document.createElement('div');

    // input 필드 아래 메시지 추가 (없으면 추가)
    if (!emailInput.parentNode.contains(resultMessage)) {
        emailInput.parentNode.appendChild(resultMessage);
    }

    // 입력된 이메일 유효성 검사
    if (!emailInput.checkValidity()) {
        resultMessage.textContent = emailInput.validationMessage;
        resultMessage.style.color = "#fe4923";
        emailInput.focus();
        return;
    }

    // 이메일 중복 여부 메시지
    axios.get(`/signup/email-duplicate-check?email=${emailInput.value}`)
        .then(response => {
            console.log("이메일 중복 여부:", response.data);
            if (response.data) {
                resultMessage.textContent = "이미 사용 중인 이메일입니다.";
                resultMessage.style.color = "#fe4923";
            } else {
                resultMessage.textContent = "사용 가능한 이메일입니다.";
                resultMessage.style.color = "black";
            }
        })
        .catch(error => {
            console.error("중복 확인 중 오류 발생:", error);
            resultMessage.textContent = "오류가 발생했습니다. 다시 시도해주세요.";
            resultMessage.style.color = "#fe4923";
        });
}


// 회원가입 - 비밀번호 확인
      document.addEventListener('DOMContentLoaded', function() {
          const passwordInput = document.getElementById('password');
          const passwordConfirmInput = document.getElementById('password-confirm');
          const resultMessage = document.createElement('div'); // 메시지를 표시할 div 추가
          passwordConfirmInput.parentNode.insertBefore(resultMessage, passwordConfirmInput.nextSibling);

          // 비밀번호 유효성 검사 함수
          function passwordConfirm() {
              const password = passwordInput.value;
              const passwordConfirm = passwordConfirmInput.value;

              if (password !== passwordConfirm) {
                  resultMessage.textContent = '비밀번호가 일치하지 않습니다.';
                  resultMessage.style.color = '#fe4923';
                  passwordConfirmInput.setCustomValidity('비밀번호가 일치하지 않습니다.');
              } else {
                  resultMessage.textContent = '비밀번호가 일치합니다.';
                  resultMessage.style.color = 'black';
                  passwordConfirmInput.setCustomValidity('');
              }
          }

          // 실시간으로 확인하기 위해 input 이벤트 리스너 추가
          passwordInput.addEventListener('input', passwordConfirm);
          passwordConfirmInput.addEventListener('input', passwordConfirm);
      });

// 회원가입 - 관심있는 키워드 선택
  document.querySelectorAll('.interested-btn').forEach(button => {
     button.addEventListener('click', function() {
     document.querySelectorAll('.interested-btn').forEach(btn => btn.classList.remove('active'));
     button.classList.add('active');
     document.getElementById('selectedCategory').value = button.getAttribute('data-value');
    });
  });

  // 회원가입 - 1회 제공량 선택
  document.querySelectorAll('.portion-btn').forEach(button => {
     button.addEventListener('click', function() {
     document.querySelectorAll('.portion-btn').forEach(btn => btn.classList.remove('active'));
     button.classList.add('active');
     document.getElementById('selectedPortion').value = button.getAttribute('data-value');
     });
  });

  // 회원가입 - 폼 제출 전 필수항목 검사 및 가입 성공메시지 모달
  document.addEventListener('DOMContentLoaded', function () {
    const signupForm = document.getElementById('signup-form');

    // 모달 초기화
    const signupSuccessModal = new bootstrap.Modal(document.getElementById('SignupSuccessModal'));
    const modalConfirmButton = document.querySelector('.signup-success-message button');

    // 폼 제출 이벤트 핸들러
    signupForm.addEventListener('submit', function (event) {
        event.preventDefault(); // 기본 제출 방지
        // 유효성 검사가 모두 통과한 경우에만 실행
        if (signupForm.checkValidity()) {
            // 회원가입 성공 모달 띄우기
            signupSuccessModal.show();
        } else {
            // 유효성 검사가 실패한 경우 에러 표시
            signupForm.reportValidity();
        }
    });

    // 모달 확인 버튼 클릭 시 폼 제출
    modalConfirmButton.addEventListener('click', () => {
        signupForm.submit();
    });
});
