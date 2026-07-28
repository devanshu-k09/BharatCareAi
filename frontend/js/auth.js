// Global Authentication & Session Management
(function() {
  const token = localStorage.getItem('token');
  const path = window.location.pathname;

  const publicRoutes = ['/', '/index', '/login', '/register'];
  const isPublicRoute = publicRoutes.some(route => path === route || path === route + '.html');

  if (!token && !isPublicRoute) {
    // Unauthenticated user trying to access a protected route
    window.location.href = '/login';
  } else if (token && (path === '/login' || path === '/register' || path === '/login.html' || path === '/register.html')) {
    // Authenticated user trying to access login/register
    window.location.href = '/dashboard';
  }
})();

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
}

window.logout = logout;
