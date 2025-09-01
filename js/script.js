// js/script.js

async function logout() {
    if (window.pe) {
        await pe.forgetPerson();
    }
    // localStorage도 함께 비워줍니다.
    localStorage.removeItem('userFirstName');
    localStorage.removeItem('userLastName');
    window.location.reload();
}

document.addEventListener('DOMContentLoaded', function() {
    const welcomeNameSpan = document.getElementById('welcomeName');
    const loginBtn = document.getElementById('goToLoginBtn');
    const logoutBtn = document.getElementById('goToLogoutBtn');

    if (loginBtn) {
        loginBtn.addEventListener('click', () => { window.location.href = 'login.html'; });
    }
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }

    // 로그인 상태 확인 로직
    function checkLoginStatus() {
        let finalUserName = '';

        // [수정] 1. localStorage를 먼저 확인 (로그인 직후 이름 표시용)
        const firstName = localStorage.getItem('userFirstName');
        const lastName = localStorage.getItem('userLastName');

        if (firstName && lastName) {
            finalUserName = `${lastName}${firstName}`;
            // 사용 후 바로 삭제하여 다음 방문 시에는 SDK 정보를 사용하도록 함
            localStorage.removeItem('userFirstName');
            localStorage.removeItem('userLastName');
        } 
        // 2. localStorage에 이름이 없으면 SDK의 정보를 확인 (페이지 이동 후)
        else if (window.pe && pe.person) {
            const person = pe.person;
            // SDK에는 이름 정보가 없으므로 전화번호만 확인
            if (person.phone) {
                finalUserName = person.phone;
            }
        }
        
        // 최종 이름 적용
        if (finalUserName) {
            welcomeNameSpan.textContent = finalUserName;
        } else {
            welcomeNameSpan.textContent = "방문자";
        }

        // 버튼 표시 여부 결정
        if (finalUserName) {
            logoutBtn.style.cssText = 'display: block !important';
            loginBtn.style.cssText = 'display: none !important';
        } else {
            logoutBtn.style.cssText = 'display: none !important';
            loginBtn.style.cssText = 'display: block !important';
        }
    }

    // SDK가 로드될 시간을 고려하여 잠시 후 실행
    setTimeout(checkLoginStatus, 200);
});