const fs = require('fs');
const path = require('path');

const frontendDir = path.join(__dirname, 'frontend');
const files = fs.readdirSync(frontendDir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const filePath = path.join(frontendDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Replace manual window.location.href redirects to login/dashboard
  const regex1 = /window\.location\.href\s*=\s*['"]([a-zA-Z0-9-]+)\.html['"]/g;
  content = content.replace(regex1, (match, p1) => {
    changed = true;
    return `window.location.href = '/${p1}'`;
  });

  // Replace href="ai-chat.html?prompt=..." with href="/ai-chat?prompt=..."
  const regex2 = /href=['"]([a-zA-Z0-9-]+)\.html\?([^'"]+)['"]/g;
  content = content.replace(regex2, (match, p1, p2) => {
    changed = true;
    return `href="/${p1}?${p2}"`;
  });

  // Replace window.location.href='ai-chat.html?id=' with window.location.href='/ai-chat?id='
  const regex3 = /window\.location\.href=['"]\$\{([^}]+)\}\.html\?id=/g;
  content = content.replace(regex3, (match, p1) => {
    changed = true;
    return `window.location.href='/\${${p1}}?id=`;
  });

  // And specifically history.html line 162: window.location.href='${item.type === 'chat' ? 'ai-chat.html?id=' + item._id : 'complaint.html?id=' + item._id}'
  if (content.includes("ai-chat.html?id=")) {
      content = content.replace(/ai-chat\.html\?id=/g, '/ai-chat?id=');
      changed = true;
  }
  if (content.includes("complaint.html?id=")) {
      content = content.replace(/complaint\.html\?id=/g, '/complaint?id=');
      changed = true;
  }


  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed more routes in', file);
  }
});
