const registerContainer = document.getElementById('register-container');
const showRegister = document.getElementById('show-register');
const backToLogin = document.getElementById('back-to-login');

showRegister.addEventListener('click', () => {
            registerContainer.classList.add('active');
        });

backToLogin.addEventListener('click', () => {
            registerContainer.classList.remove('active');
        });