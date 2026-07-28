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

// Automatically sync user profile avatars across all page views
document.addEventListener('DOMContentLoaded', () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      if (user) {
        const API_BASE_URL = window.location.protocol === 'file:' ? 'http://localhost:5000' : '';
        const avatarUrl = user.avatar 
          ? (user.avatar.startsWith('http') || user.avatar.startsWith('data:') ? user.avatar : `${API_BASE_URL}${user.avatar}`) 
          : null;
        
        document.querySelectorAll('img').forEach(img => {
          if (img.src && (img.src.includes('ui-avatars.com/api/') || img.src.includes('/uploads/avatars/'))) {
            if (avatarUrl) {
              img.src = avatarUrl;
            } else if (user.name) {
              // Custom default avatar using user name
              const nameQuery = encodeURIComponent(user.name);
              img.src = `https://ui-avatars.com/api/?name=${nameQuery}&background=0D8ABC&color=fff`;
            }
          }
        });
      }
    } catch (e) {
      console.error('Error synchronizing user avatar:', e);
    }
  }
});
