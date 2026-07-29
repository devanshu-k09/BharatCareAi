const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'frontend', 'css', 'style.css');
let cssContent = fs.readFileSync(cssPath, 'utf8');

const newCSS = `
/* ========================================= */
/* New Glassmorphism Top Header & Search      */
/* ========================================= */

.glass-header {
    background: rgba(255, 255, 255, 0.75);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(224, 227, 229, 0.5);
    box-shadow: 0 4px 24px -6px rgba(0, 0, 0, 0.05);
    border-radius: 16px;
    margin: 16px var(--spacing-lg) var(--spacing-md) var(--spacing-lg);
    padding: var(--spacing-sm) var(--spacing-lg);
    height: auto;
    min-height: 64px;
    top: 16px; /* Sticky floating gap */
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    transition: all 0.3s ease;
}

.header-left {
    display: flex;
    justify-content: flex-start;
    align-items: center;
}

.header-center {
    display: flex;
    justify-content: center;
    width: 100%;
}

.header-right {
    display: flex;
    justify-content: flex-end;
    align-items: center;
}

.search-wrapper {
    position: relative;
    width: 100%;
    max-width: 600px;
}

.search-input-container {
    position: relative;
    width: 100%;
    transition: all 0.3s ease;
}

.pill-search {
    border-radius: 9999px !important;
    background: rgba(242, 244, 246, 0.5) !important;
    border: 1px solid var(--border) !important;
    padding: 0.6rem 1rem 0.6rem 2.5rem !important;
    transition: all 0.3s ease !important;
    box-shadow: 0 2px 8px rgba(0,0,0,0.02) !important;
}

.pill-search:focus {
    background: var(--surface) !important;
    border-color: var(--primary) !important;
    box-shadow: 0 4px 12px rgba(0, 35, 111, 0.08) !important;
}

.search-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-muted);
    font-size: 20px;
    pointer-events: none;
    z-index: 10;
}

.dropdown-menu {
    position: absolute;
    top: calc(100% + 8px);
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    z-index: 100;
    overflow: hidden;
    animation: slideUp 0.2s ease forwards;
}

.search-dropdown {
    left: 0;
    width: 100%;
    max-height: 300px;
    overflow-y: auto;
}

.profile-dropdown {
    right: 0;
    min-width: 200px;
}

.dropdown-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm) var(--spacing-md);
    color: var(--text-primary);
    text-decoration: none;
    transition: background 0.2s ease;
}

.dropdown-item:hover {
    background: var(--surface-low);
    color: var(--primary);
}

.dropdown-item .material-symbols-outlined {
    font-size: 20px;
    opacity: 0.7;
}

.dropdown-divider {
    height: 1px;
    background: var(--border);
    margin: var(--spacing-xs) 0;
}

.profile-section {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: 4px 8px;
    border-radius: var(--radius-lg);
    transition: background 0.2s ease;
}

.profile-section:hover {
    background: var(--surface-low);
}

.premium-badge {
    background: rgba(49, 107, 243, 0.1);
    color: var(--secondary-light);
    padding: 2px 6px;
    border-radius: 4px;
    font-weight: 600;
}

/* Override sticky z-index for sidebar if needed, ensuring header floats over content */

/* Responsive Updates */
@media (max-width: 1024px) {
    .glass-header {
        grid-template-columns: auto 1fr auto;
        gap: var(--spacing-md);
    }
}

@media (max-width: 768px) {
    .glass-header {
        margin: 8px var(--spacing-sm);
        padding: var(--spacing-sm);
        border-radius: 12px;
        top: 8px;
        grid-template-columns: auto 1fr auto;
        gap: var(--spacing-sm);
    }
    
    .pill-search {
        padding: 0.5rem 1rem 0.5rem 2.2rem !important;
    }
}
`;

if (!cssContent.includes('.glass-header')) {
    fs.appendFileSync(cssPath, newCSS);
    console.log('CSS updated successfully.');
} else {
    console.log('CSS already contains .glass-header rules.');
}
