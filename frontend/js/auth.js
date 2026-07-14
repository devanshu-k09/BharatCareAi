const API_URL = 'http://localhost:5000/api/auth';

function showToast(message, isError = false) {
  const toastContainer = document.getElementById('toast-container');
  if (!toastContainer) return;
  const bgClass = isError ? 'bg-danger' : 'bg-success';
  const toastHTML = `
    <div class="toast align-items-center text-white ${bgClass} border-0 show" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="d-flex">
        <div class="toast-body">
          ${message}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    </div>
  `;
  toastContainer.innerHTML = toastHTML;
  setTimeout(() => {
    toastContainer.innerHTML = '';
  }, 3000);
}

async function registerUser(e) {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const btn = document.getElementById('register-btn');
  
  try {
    btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Loading...';
    btn.disabled = true;
    const res = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      showToast('Registration successful!');
      setTimeout(() => window.location.href = 'dashboard.html', 1500);
    } else {
      showToast(data.message || 'Registration failed', true);
    }
  } catch (error) {
    showToast('Server error', true);
  } finally {
    btn.innerHTML = 'Register';
    btn.disabled = false;
  }
}

async function loginUser(e) {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const btn = document.getElementById('login-btn');
  
  try {
    btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Loading...';
    btn.disabled = true;
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      showToast('Login successful!');
      setTimeout(() => window.location.href = 'dashboard.html', 1500);
    } else {
      showToast(data.message || 'Login failed', true);
    }
  } catch (error) {
    showToast('Server error', true);
  } finally {
    btn.innerHTML = 'Login';
    btn.disabled = false;
  }
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'login.html';
}

// Attach event listeners
const registerForm = document.getElementById('register-form');
if (registerForm) registerForm.addEventListener('submit', registerUser);

const loginForm = document.getElementById('login-form');
if (loginForm) loginForm.addEventListener('submit', loginUser);
