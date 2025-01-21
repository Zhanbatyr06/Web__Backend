const API_BASE_URL = 'http://localhost:8080/api/auth'; // Ваш API URL
console.log('Hello, World!');


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
        document.getElementById('register-message').textContent = data.message || 'Registration successful!';
    } catch (error) {
        document.getElementById('register-message').textContent = 'An error occurred. Please try again.';
        console.error(error);
    }
});

// Логин
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            document.getElementById('login-message').textContent = `Login successful! Token: ${data.token}`;
        } else {
            document.getElementById('login-message').textContent = data.message || 'Invalid credentials';
        }
    } catch (error) {
        document.getElementById('login-message').textContent = 'An error occurred. Please try again.';
        console.error(error);
    }
});
