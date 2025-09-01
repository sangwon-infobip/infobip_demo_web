// js/login.js

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            
            const mobileInput = document.getElementById('mobile');
            const mobile = mobileInput.value.trim();
            
            if (!mobile) {
                alert('휴대폰 번호를 입력해주세요.');
                mobileInput.focus();
                return;
            }

            const loginBtn = loginForm.querySelector('.login-btn');

            try {
                loginBtn.disabled = true;
                loginBtn.textContent = '로그인 중...';

                const apiUrl = 'https://uc57igyqqa.execute-api.ap-northeast-2.amazonaws.com/getUserInfo'; 

                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ phone: mobile }),
                });

                if (response.ok) {
                    const userData = await response.json();

                    if (userData.firstName && userData.lastName) {
                        alert('로그인 성공하였습니다');

                        // [수정] pe.setPerson에는 전화번호만 전달합니다.
                        if (window.pe) {
                            await pe.setPerson({
                                phone: mobile
                            });
                            console.log(`Infobip: Session started for ${mobile}`);
                        }

                        // [추가] 홈페이지에 첫 방문 시 이름을 보여주기 위해 localStorage를 임시로 사용합니다.
                        localStorage.setItem('userFirstName', userData.firstName);
                        localStorage.setItem('userLastName', userData.lastName);
                        
                        window.location.href = 'index.html';
                    } else {
                        throw new Error('응답 데이터에 이름 정보가 없습니다.');
                    }
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.error || '로그인에 실패했습니다.');
                }

            } catch (error) {
                console.error('Login failed:', error);
                alert(error.message);
                loginBtn.disabled = false;
                loginBtn.textContent = 'Login';
            }
        });
    }
});