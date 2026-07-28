document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  
  const publicPages = ['login.html', 'register.html', 'index.html', ''];
  const path = window.location.pathname;
  const currentPage = path.substring(path.lastIndexOf('/') + 1);

  if (!token && !publicPages.includes(currentPage)) {
    window.location.href = 'login.html';
  }

  // Dark Mode Toggle
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const isDark = document.body.classList.contains('dark-mode');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      themeToggleBtn.innerHTML = isDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    });
    
    if (localStorage.getItem('theme') === 'dark') {
      document.body.classList.add('dark-mode');
      themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }
  }

  // Set Username in UI
  const userNameDisplay = document.getElementById('user-name-display');
  if (userNameDisplay && user) {
    userNameDisplay.innerText = user.name;
  }
});

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'login.html';
}
