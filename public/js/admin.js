// ===================================
// ADMIN LOGIN FUNCTIONALITY
// ===================================
if (document.getElementById('adminLoginForm')) {
    const loginForm = document.getElementById('adminLoginForm');
    const errorMessage = document.getElementById('errorMessage');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Store login status in sessionStorage
                sessionStorage.setItem('adminLoggedIn', 'true');
                // Redirect to dashboard
                window.location.href = '/admin-dashboard.html';
            } else {
                errorMessage.textContent = data.message || 'Username atau password salah!';
                errorMessage.style.display = 'block';
            }
        } catch (error) {
            console.error('Login error:', error);
            errorMessage.textContent = 'Terjadi kesalahan. Silakan coba lagi.';
            errorMessage.style.display = 'block';
        }
    });
}
