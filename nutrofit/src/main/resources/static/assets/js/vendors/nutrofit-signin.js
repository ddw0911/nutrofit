document.addEventListener("DOMContentLoaded", function () {
    // 페이지 로드 시 Local Storage에서 아이디와 체크박스 상태를 가져옴
    const savedId = localStorage.getItem("memberId");
    const isChecked = localStorage.getItem("rememberIdChecked") === "true";

    if (savedId && isChecked) {
        document.getElementById("userId").value = savedId;
        document.getElementById("rememberIdCheckbox").checked = isChecked;
    }

    // 체크박스 상태 변경 시 즉시 저장
    document.getElementById("rememberIdCheckbox").addEventListener("change", function() {
        const rememberId = this.checked;
        const memberId = document.getElementById("userId").value;

        if (rememberId) {
            localStorage.setItem("memberId", memberId);
            localStorage.setItem("rememberIdChecked", "true");
        } else {
            localStorage.removeItem("memberId");
            localStorage.removeItem("rememberIdChecked");
        }
    });

    // 로그인 폼 제출 시
    document.querySelector("form").addEventListener("submit", function () {
        const rememberId = document.getElementById("rememberIdCheckbox").checked;
        const memberId = document.getElementById("userId").value;

        if (rememberId) {
            localStorage.setItem("memberId", memberId); // 아이디 업데이트
        }
    });
});