const fs = require('fs');
const path = require('path');

const frontendDir = path.join(__dirname, 'frontend');

const newHeaderHtml = `<header class="top-header glass-header">
    <div class="header-left">
        <button class="btn btn-icon mobile-menu-toggle"><span class="material-symbols-outlined">menu</span></button>
    </div>
    
    <div class="header-center search-wrapper">
        <div class="search-input-container relative">
            <span class="material-symbols-outlined search-icon">search</span>
            <input type="text" id="global-search" class="form-control pill-search" placeholder="Search legal questions, complaints, rights..." autocomplete="off">
            <!-- Search Dropdown -->
            <div id="search-dropdown" class="dropdown-menu search-dropdown d-none"></div>
        </div>
    </div>

    <div class="header-right">
        <div class="profile-section relative cursor-pointer" id="profile-toggle" tabindex="0" role="button" aria-haspopup="true">
            <div class="d-none-mobile text-right mr-sm">
                <h4 class="user-name-display m-0" style="font-size: 0.875rem;">Loading...</h4>
                <span class="premium-badge text-muted" style="font-size: 0.75rem;">Premium User</span>
            </div>
            <img src="https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff" id="nav-avatar" class="avatar-img" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">
            
            <!-- Profile Dropdown -->
            <div id="profile-dropdown" class="dropdown-menu profile-dropdown d-none">
                <a href="profile.html" class="dropdown-item"><span class="material-symbols-outlined">person</span> Profile</a>
                <a href="settings.html" class="dropdown-item"><span class="material-symbols-outlined">settings</span> Settings</a>
                <div class="dropdown-divider"></div>
                <a href="#" id="logout-btn" class="dropdown-item text-error"><span class="material-symbols-outlined">logout</span> Logout</a>
            </div>
        </div>
    </div>
</header>`;

const htmlFiles = fs.readdirSync(frontendDir).filter(f => f.endsWith('.html'));

htmlFiles.forEach(file => {
    const filePath = path.join(frontendDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace the header
    content = content.replace(/<header class="top-header">[\s\S]*?<\/header>/g, newHeaderHtml);
    
    // Inject nav.js before </body> if not present
    if (!content.includes('<script src="js/nav.js"></script>')) {
        content = content.replace('</body>', '    <script src="js/nav.js"></script>\n</body>');
    }
    
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file}`);
});
