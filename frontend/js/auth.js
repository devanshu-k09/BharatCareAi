// Global Authentication & Session Management
(function() {
  const token = localStorage.getItem('token');
  const path = window.location.pathname;

  const publicRoutes = ['/', '/index', '/login', '/register'];
  const isPublicRoute = publicRoutes.some(route => path === route || path === route + '.html');

  if (!token && !isPublicRoute) {
    // Unauthenticated user trying to access a protected route
    window.location.href = 'login.html';
  } else if (token && (path === '/login' || path === '/register' || path === '/login.html' || path === '/register.html')) {
    // Authenticated user trying to access login/register
    window.location.href = 'dashboard.html';
  }
})();

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'login.html';
}

window.logout = logout;

// Function to update all user profile elements across the document
function syncUserProfileData(user) {
  if (!user) return;
  const API_BASE_URL = window.location.protocol === 'file:' ? 'http://localhost:5000' : '';
  const avatarUrl = user.avatar 
    ? (user.avatar.startsWith('http') || user.avatar.startsWith('data:') ? user.avatar : `${API_BASE_URL}${user.avatar}`) 
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=0D8ABC&color=fff`;

  document.querySelectorAll('img').forEach(img => {
    if (img.id === 'profileAvatar' || (img.src && (img.src.includes('ui-avatars.com/api/') || img.src.includes('/uploads/avatars/')))) {
      img.src = avatarUrl;
    }
  });

  if (user.name) {
    document.querySelectorAll('.user-name-display').forEach(el => el.textContent = user.name);
  }
  if (user.email) {
    document.querySelectorAll('.user-email-display').forEach(el => el.textContent = user.email);
  }
}

window.syncUserProfileData = syncUserProfileData;

document.addEventListener('DOMContentLoaded', () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      syncUserProfileData(user);
    } catch (e) {
      console.error('Error synchronizing user profile:', e);
    }
  }
});

// Responsive Mobile Navigation Handler (Requirement 14 & 20)
document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.getElementById('sidebar');
  if (sidebar) {
    let backdrop = document.querySelector('.sidebar-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'sidebar-backdrop';
      document.body.appendChild(backdrop);
    }

    const toggleBtns = document.querySelectorAll('.mobile-menu-toggle, #mobileMenuBtn');
    toggleBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        sidebar.classList.toggle('open');
        backdrop.classList.toggle('active');
      });
    });

    backdrop.addEventListener('click', () => {
      sidebar.classList.remove('open');
      backdrop.classList.remove('active');
    });

    // Close sidebar when clicking a nav link on small screens
    sidebar.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          sidebar.classList.remove('open');
          backdrop.classList.remove('active');
        }
      });
    });
  }
});
