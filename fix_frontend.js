const fs = require('fs');
const path = require('path');

const frontendDir = path.join(__dirname, 'frontend');

// 1. Categories
let categoriesFile = path.join(frontendDir, 'categories.html');
let categoriesContent = fs.readFileSync(categoriesFile, 'utf8');
categoriesContent = categoriesContent.replace(/<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">[\s\S]*?<\/div>\s*<!-- Background/, `<div id="categories-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg"></div>
<!-- Background`);
categoriesContent = categoriesContent.replace('</body>', `
<script>
  async function loadCategories() {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/data/categories', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      const data = await res.json();
      const container = document.getElementById('categories-container');
      container.innerHTML = data.map(cat => \`
        <div class="category-card flex flex-col bg-surface-container-lowest border border-outline-variant rounded-xl p-lg card-elevation transition-all duration-300 group">
            <div class="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mb-md group-hover:bg-primary transition-colors duration-300">
                <span class="material-symbols-outlined text-primary group-hover:text-on-primary transition-colors">\${cat.icon.replace('fa-', '')}</span>
            </div>
            <h3 class="font-headline-md text-headline-md text-primary mb-sm">\${cat.title}</h3>
            <p class="font-body-md text-body-md text-on-surface-variant mb-xl flex-grow">\${cat.description}</p>
            <ul class="mb-md text-sm text-on-surface-variant list-disc pl-5">
              \${cat.commonIssues.slice(0,2).map(issue => '<li>' + issue + '</li>').join('')}
            </ul>
            <button onclick="window.location.href='ai-chat.html'" class="w-full flex items-center justify-center gap-sm bg-primary text-on-primary font-label-md text-label-md py-md rounded-lg hover:bg-primary-container transition-colors shadow-sm">
                Get Help <span class="material-symbols-outlined text-body-md">arrow_forward</span>
            </button>
        </div>
      \`).join('');
    } catch(err) { console.error(err); }
  }
  loadCategories();
</script>
</body>`);
fs.writeFileSync(categoriesFile, categoriesContent);

// 2. Authorities
let authoritiesFile = path.join(frontendDir, 'authorities.html');
let authoritiesContent = fs.readFileSync(authoritiesFile, 'utf8');
authoritiesContent = authoritiesContent.replace(/<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-xl">[\s\S]*?<\/div>\s*<!-- Atmospheric Background/, `<div id="authorities-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-xl"></div>
<!-- Atmospheric Background`);
authoritiesContent = authoritiesContent.replace('</body>', `
<script>
  async function loadAuthorities() {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/data/authorities', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      const data = await res.json();
      const container = document.getElementById('authorities-container');
      container.innerHTML = data.map(auth => \`
        <div class="glass-panel flex flex-col bg-surface-container-lowest border border-outline-variant rounded-xl p-lg card-elevation transition-all duration-300 relative overflow-hidden group">
            <div class="mb-md">
                <span class="inline-block bg-primary-container text-on-primary-container font-label-sm text-label-sm px-sm py-xs rounded-md mb-sm">\${auth.officeType}</span>
                <h3 class="font-headline-md text-headline-md text-primary leading-tight">\${auth.name}</h3>
            </div>
            <p class="font-body-sm text-body-sm text-on-surface-variant mb-xl flex-grow">\${auth.description}</p>
            <div class="flex flex-col gap-sm mb-xl">
                <div class="flex items-center gap-sm text-on-surface-variant font-body-sm text-body-sm">
                    <span class="material-symbols-outlined text-[18px]">call</span>
                    <span>\${auth.contactNumber}</span>
                </div>
            </div>
            <a href="\${auth.website}" target="_blank" class="mt-auto w-full text-center bg-primary text-on-primary font-label-md text-label-md py-3 rounded-lg hover:shadow-lg transition-all">Visit Website</a>
        </div>
      \`).join('');
    } catch(err) { console.error(err); }
  }
  loadAuthorities();
</script>
</body>`);
fs.writeFileSync(authoritiesFile, authoritiesContent);

// 3. History
let historyFile = path.join(frontendDir, 'history.html');
let historyContent = fs.readFileSync(historyFile, 'utf8');
historyContent = historyContent.replace(/<!-- Interaction List \(Bento-lite Layout\) -->[\s\S]*?<!-- Pagination -->/, `<div id="history-container" class="grid grid-cols-1 gap-md"></div>
<!-- Pagination -->`);
historyContent = historyContent.replace('</body>', `
<script>
  async function loadHistory() {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/ai/chats', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      const chats = await res.json();
      
      const res2 = await fetch('http://localhost:5000/api/complaints', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      const complaints = await res2.json();
      
      const allHistory = [...chats.map(c => ({...c, type: 'chat'})), ...complaints.map(c => ({...c, type: 'complaint'}))]
        .sort((a,b) => new Date(b.createdAt || b.updatedAt) - new Date(a.createdAt || a.updatedAt));

      const container = document.getElementById('history-container');
      if (allHistory.length === 0) {
        container.innerHTML = '<p class="text-on-surface-variant p-lg">No past questions found.</p>';
        return;
      }
      container.innerHTML = allHistory.map(item => \`
        <div class="glass-card custom-shadow rounded-xl p-lg flex items-center justify-between group hover:border-primary/30 transition-all duration-300">
            <div class="flex items-start gap-lg">
                <div class="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
                    <span class="material-symbols-outlined">\${item.type === 'chat' ? 'forum' : 'description'}</span>
                </div>
                <div>
                    <h3 class="font-headline-md text-body-lg font-bold">\${item.title || item.type + ' Draft'}</h3>
                    <div class="flex items-center gap-md text-on-surface-variant font-body-sm text-body-sm mt-1">
                        <span class="flex items-center gap-xs">
                            <span class="material-symbols-outlined text-[16px]">calendar_today</span>
                            \${new Date(item.createdAt || item.updatedAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </div>
            <div class="flex items-center gap-md">
                <button onclick="window.location.href='\${item.type === 'chat' ? 'ai-chat.html' : 'complaint.html'}'" class="bg-primary text-on-primary font-label-md text-label-md px-lg py-sm rounded-lg hover:shadow-md active:scale-95 transition-all">
                    View
                </button>
            </div>
        </div>
      \`).join('');
    } catch(err) { console.error(err); }
  }
  loadHistory();
</script>
</body>`);
fs.writeFileSync(historyFile, historyContent);

console.log("Done fixing frontend");
