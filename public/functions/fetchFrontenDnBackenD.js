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
        document.getElementById('register-message').textContent = data.message || 'Registration successful!';
    } catch (error) {
        document.getElementById('register-message').textContent = 'An error occurred. Please try again.';
        console.error(error);
    }
});

// Логин
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
    