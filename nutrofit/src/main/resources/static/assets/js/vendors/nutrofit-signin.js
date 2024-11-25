document.addEventListener("DOMContentLoaded", function () {
    // 페이지 로드 시 Local Storage 에서 아이디를 가져와 입력란에 채움
    const savedId = localStorage.getItem("memberId");
    if (savedId) {
        document.getElementById("userId").value = savedId;
        document.getElementById("rememberIdCheckbox").checked = true;
    }

    // 로그인 폼 제출 시, 체크박스 상태에 따라 아이디 저장
    document.querySelector("form").addEventListener("submit", function () {
        const rememberId = document.getElementById("rememberIdCheckbox").checked;
        const memberId = document.getElementById("userId").value;

        if (rememberId) {
            localStorage.setItem("memberId", memberId); // Local Storage에 아이디 저장
        } else {
            localStorage.removeItem("memberId"); // 체크 해제 시 아이디 삭제
        }
    });
});
