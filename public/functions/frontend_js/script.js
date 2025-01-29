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
});