document.getElementById('loginForm').addEventListener('submit', function(event) {
    let valid = true;
    const name = document.getElementById('username').value;
    if (/\d/.test(name)) {
        alert('Name should not contain digits.');
        valid = false;
    }
    const email = document.getElementById('email').value;
    if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email)) {
        alert('Please enter a valid email address (e.g., name@gmail.com).');
        valid = false;
    }
    const password = document.getElementById('password').value;
    if (password.length <= 6) {
        alert('Password should be more than 6 characters.');
        valid = false;
    }
    if (!valid) {
        event.preventDefault();
    }
});