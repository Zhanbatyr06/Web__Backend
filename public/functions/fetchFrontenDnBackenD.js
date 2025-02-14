const API_BASE_URL = 'http://localhost:3000/api/auth';

document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password }),
        });

        const data = await response.json();
        const notification = document.getElementById('notification');

        notification.className = 'notification';

        if (response.ok) {
            notification.classList.add('success');
            notification.textContent = 'Регистрация успешно завершена!';
            notification.style.display = 'block';

            setTimeout(() => {
                notification.style.display = 'none';
                window.location.href = '/main.html';
            }, 3000);
        } else {
            notification.classList.add('error');
            notification.textContent = data.message === 'Email already registered'
                ? 'Этот email уже зарегистрирован!'
                : 'Ошибка при регистрации!';
            notification.style.display = 'block';

            setTimeout(() => {
                notification.style.display = 'none';
            }, 3000);
        }
    } catch (error) {
        const notification = document.getElementById('notification');
        notification.className = 'notification error';
        notification.textContent = 'Произошла ошибка. Пожалуйста, попробуйте снова.';
        notification.style.display = 'block';

        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);

        console.error(error);
    }
});

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok && data.userId) {
            // Скрываем контейнер логина
            document.querySelector('.login-container').style.display = 'none';
            document.getElementById('twoFA-card').style.display = 'block';
            // Отображаем форму для ввода 2FA-кода
            document.getElementById('twoFA-form').style.display = 'block';
            // Сохраняем userId для дальнейшей проверки 2FA
            document.getElementById('twoFA-form').setAttribute('data-userid', data.userId);
            // Выводим сообщение для пользователя (при необходимости)
            document.getElementById('twoFA-message').textContent = data.message;
        } else {
            // Выводим сообщение об ошибке (например, в элементе с id="login-message")
            document.getElementById('login-message').textContent = data.message || 'Неверные учетные данные';
        }
    } catch (error) {
        document.getElementById('login-message').textContent = 'Произошла ошибка. Пожалуйста, попробуйте снова.';
        console.error(error);
    }
});
// Логика верификации 2FA (второй шаг)
document.getElementById('twoFA-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const userId = document.getElementById('twoFA-form').getAttribute('data-userid');
    const code = document.getElementById('twoFA-code').value;

    try {
        const response = await fetch(`${API_BASE_URL}/verify-2fa`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, code }),
        });

        const data = await response.json();

        if (response.ok && data.token) {
            // Сохранить полученный токен и перенаправить к основному контенту
            localStorage.setItem('authToken', data.token);
            window.location.href = '/main.html';
        } else {
            // Если верификация не проходит, отобразить ошибку
            document.getElementById('twoFA-error').textContent = data.message || 'Неверный код. Попробуйте снова.';
        }
    } catch (error) {
        document.getElementById('twoFA-error').textContent = 'Произошла ошибка. Пожалуйста, попробуйте снова.';
        console.error(error);
    }
});
