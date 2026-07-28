const fs = require('fs');
const path = require('path');

const frontendDir = path.join(__dirname, 'frontend');
const files = fs.readdirSync(frontendDir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const filePath = path.join(frontendDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Replace href="index.html" with href="/"
  if (content.includes('href="index.html"')) {
    content = content.replace(/href="index\.html"/g, 'href="/"');
    changed = true;
  }
  if (content.includes("window.location.href='index.html'") || content.includes('window.location.href="index.html"')) {
    content = content.replace(/window\.location\.href=['"]index\.html['"]/g, 'window.location.href="/"');
    changed = true;
  }

  // Replace other .html links
  const regex = /href="([^"]+)\.html"/g;
  content = content.replace(regex, (match, p1) => {
    if (p1.startsWith('http') || p1.startsWith('//')) return match;
    changed = true;
    return `href="/${p1}"`;
  });

  const jsRegex = /window\.location\.href=['"]([^'"]+)\.html['"]/g;
  content = content.replace(jsRegex, (match, p1) => {
    if (p1.startsWith('http') || p1.startsWith('//')) return match;
    changed = true;
    return `window.location.href="/${p1}"`;
  });

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed routes in', file);
  }
});
