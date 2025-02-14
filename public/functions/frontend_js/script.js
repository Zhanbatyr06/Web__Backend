document.addEventListener("DOMContentLoaded", () => {
    const loginContainer = document.querySelector(".login-container");
    const registerContainer = document.querySelector(".register-container");
    const showRegisterButton = document.getElementById("show-register");
    const backToLoginButton = document.getElementById("back-to-login");

    // Show registration form
    showRegisterButton.addEventListener("click", (e) => {
        e.preventDefault();
        registerContainer.classList.add("active");
        loginContainer.classList.add("hidden");
    });

    // Show login form
    backToLoginButton.addEventListener("click", (e) => {
        e.preventDefault();
        registerContainer.classList.remove("active");
        loginContainer.classList.remove("hidden");
    });

    window.addEventListener("pageshow", (event) => {
        // Если страница загружена из кэша, сбрасываем состояние нужных элементов
        if (event.persisted) {
            const loginContainer = document.querySelector(".login-container");
            loginContainer.classList.remove("hidden");

            const registerContainer = document.getElementById("register-container");
            registerContainer.classList.remove("active");

            // Здесь также можно сбросить значения полей, если требуется
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';
        }
    });

});

document.getElementById('twoFA-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log("Началась обработка 2FA формы");

    const userId = document.getElementById('twoFA-form').getAttribute('data-userid');
    const code = document.getElementById('twoFA-code').value;

    try {
        const response = await fetch(`${API_BASE_URL}/verify-2fa`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, code }),
        });
        console.log("Ответ от сервера после проверки 2FA", response);

        const data = await response.json();
        if (response.ok && data.token) {
            window.location.href = '/main.html';
        } else {
            document.getElementById('twoFA-error').textContent = data.message || 'Ошибка верификации';
        }
    } catch (error) {
        document.getElementById('twoFA-error').textContent = 'Произошла ошибка. Попробуйте снова.';
        console.error("Ошибка в обработчике 2FA:", error);
    }
});


