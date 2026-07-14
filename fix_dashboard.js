const fs = require('fs');
const path = require('path');

const frontendDir = path.join(__dirname, 'frontend');

let dashFile = path.join(frontendDir, 'dashboard.html');
let dashContent = fs.readFileSync(dashFile, 'utf8');

dashContent = dashContent.replace(/<div class="divide-y divide-outline-variant">[\s\S]*?<\/div>\s*<\/section>/, `<div id="recent-convos-container" class="divide-y divide-outline-variant"></div>
</section>`);

dashContent = dashContent.replace('</body>', `
<script>
  async function loadDashboardHistory() {
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
        .sort((a,b) => new Date(b.createdAt || b.updatedAt) - new Date(a.createdAt || a.updatedAt))
        .slice(0, 3); // Top 3

      const container = document.getElementById('recent-convos-container');
      if (allHistory.length === 0) {
        container.innerHTML = '<p class="text-on-surface-variant p-md">No recent conversations.</p>';
        return;
      }
      container.innerHTML = allHistory.map(item => \`
        <div onclick="window.location.href='\${item.type === 'chat' ? 'ai-chat.html' : 'complaint.html'}'" class="p-lg hover:bg-surface-container-low transition-colors flex items-center gap-md cursor-pointer">
            <div class="\${item.type === 'chat' ? 'w-12 h-12 bg-primary-container rounded-full flex items-center justify-center shrink-0' : 'w-12 h-12 bg-surface-container-high rounded-full flex items-center justify-center shrink-0'}">
                <span class="material-symbols-outlined \${item.type === 'chat' ? 'text-on-primary-container' : 'text-on-surface-variant'}">\${item.type === 'chat' ? 'chat' : 'description'}</span>
            </div>
            <div class="flex-grow">
                <div class="flex justify-between mb-1">
                    <h4 class="font-label-md text-label-md font-bold text-on-surface line-clamp-1">\${item.title || item.type + ' Draft'}</h4>
                    <span class="font-label-sm text-label-sm text-outline">\${new Date(item.createdAt || item.updatedAt).toLocaleDateString()}</span>
                </div>
            </div>
        </div>
      \`).join('');
    } catch(err) { console.error(err); }
  }
  loadDashboardHistory();
</script>
</body>`);

fs.writeFileSync(dashFile, dashContent);
console.log("Fixed dashboard history.");
