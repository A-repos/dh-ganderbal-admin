import { disablelgnButton, enableButton } from './button.js';
window.addEventListener("DOMContentLoaded", () => {
    const loginBtn = document.getElementById("login-btn");
    loginBtn.addEventListener("click", login);
    document.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            login(event);
        }
    });
});


async function login(event) {
    event.preventDefault();
    disablelgnButton(loginBtn);
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    try {
        const response = await fetch('https://dh-ganderbal-backend.onrender.com/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            }),
            credentials: 'include',        // Important to include cookies in requests
        });
        if (response.ok) {
            // No need to handle the token, as it's stored in a cookie
            window.location.href = "./main.html";
        } else {
            const errorData = await response.json();
            alert(errorData.message);
            enableButton(loginBtn);
        }
    } catch (error) {
        console.error(error);
        alert('Login error: ' + error.message);
        enableButton(loginBtn);
    }
}



