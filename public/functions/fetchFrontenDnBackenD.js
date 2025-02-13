const API_BASE_URL = 'http://localhost:3000/api/auth'; // Ваш API URL



// Регистрация
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

        // Очищаем предыдущие классы
        notification.className = 'notification';

        if (response.ok) {
            // Успешная регистрация
            notification.classList.add('success');
            notification.textContent = 'Регистрация успешно завершена!';
            notification.style.display = 'block';

            setTimeout(() => {
                notification.style.display = 'none';
                window.location.href = '/main.html';
            }, 3000);
        } else {
            // Ошибка регистрации
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

// Логин
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value; // Corrected to match the HTML ID
    const password = document.getElementById('password').value; // Corrected to match the HTML ID

    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {
            // Login successful: store token and redirect
            localStorage.setItem('authToken', data.token); // Optionally store the token in localStorage
            window.location.href = '/main.html'; // Redirect to the dashboard page
        } else {
            document.getElementById('login-message').textContent = data.message || 'Invalid credentials';
        }
    } catch (error) {
        document.getElementById('login-message').textContent = 'An error occurred. Please try again.';
        console.error(error);
    }
});
    