document.addEventListener('DOMContentLoaded', () => {
    // -----------------------------------------------------
    // Profile Dropdown Logic
    // -----------------------------------------------------
    const profileToggle = document.getElementById('profile-toggle');
    const profileDropdown = document.getElementById('profile-dropdown');
    
    if (profileToggle && profileDropdown) {
        profileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            profileDropdown.classList.toggle('d-none');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!profileToggle.contains(e.target)) {
                profileDropdown.classList.add('d-none');
            }
        });

        // Close on ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                profileDropdown.classList.add('d-none');
            }
        });
    }

    // -----------------------------------------------------
    // Logout Logic
    // -----------------------------------------------------
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('token');
            localStorage.removeItem('userName');
            window.location.href = 'index.html';
        });
    }

    // -----------------------------------------------------
    // Global Search Logic
    // -----------------------------------------------------
    const searchInput = document.getElementById('global-search');
    const searchDropdown = document.getElementById('search-dropdown');

    const searchData = [
        { title: 'AI Legal Assistant', url: 'ai-chat.html', keywords: ['ai', 'chat', 'bot', 'assistant', 'legal'] },
        { title: 'Consumer Complaint', url: 'complaint.html', keywords: ['consumer', 'complaint', 'file', 'generator', 'draft'] },
        { title: 'Tenant Rights', url: 'categories.html', keywords: ['tenant', 'rent', 'landlord', 'rights', 'lease', 'property', 'dispute'] },
        { title: 'Cyber Crime', url: 'categories.html', keywords: ['cyber', 'crime', 'online', 'fraud', 'internet', 'complaint'] },
        { title: 'Explore My Rights', url: 'categories.html', keywords: ['explore', 'rights', 'categories', 'law'] },
        { title: 'Government Help', url: 'authorities.html', keywords: ['government', 'help', 'authorities', 'official', 'contact'] },
        { title: 'My Past Questions', url: 'history.html', keywords: ['past', 'questions', 'history', 'saved', 'recent'] },
        { title: 'Profile Settings', url: 'profile.html', keywords: ['profile', 'settings', 'account', 'password'] },
        { title: 'Admin Dashboard', url: 'admin.html', keywords: ['admin', 'dashboard', 'panel'] }
    ];

    if (searchInput && searchDropdown) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            
            if (query.length < 1) {
                searchDropdown.classList.add('d-none');
                return;
            }

            // Filter data
            const results = searchData.filter(item => {
                if (item.title.toLowerCase().includes(query)) return true;
                return item.keywords.some(kw => kw.includes(query));
            });

            // Render results
            searchDropdown.innerHTML = '';
            if (results.length > 0) {
                results.forEach(item => {
                    const a = document.createElement('a');
                    a.href = item.url;
                    a.className = 'dropdown-item d-flex align-center';
                    a.innerHTML = `<span class="material-symbols-outlined mr-sm text-primary" style="font-size:18px;">arrow_forward</span> ${item.title}`;
                    searchDropdown.appendChild(a);
                });
            } else {
                searchDropdown.innerHTML = `<div class="dropdown-item text-muted" style="cursor:default;">No results found</div>`;
            }
            
            searchDropdown.classList.remove('d-none');
        });

        // Close search dropdown on click outside
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
                searchDropdown.classList.add('d-none');
            }
        });

        // Show dropdown if input is focused and has text
        searchInput.addEventListener('focus', () => {
            if (searchInput.value.trim().length > 0) {
                searchDropdown.classList.remove('d-none');
            }
        });
    }
});
