const fs = require('fs');
const path = require('path');

const frontendDir = path.join(__dirname, 'frontend');
const files = fs.readdirSync(frontendDir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const filePath = path.join(frontendDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Check if auth.js is already included
  if (!content.includes('js/auth.js')) {
    // Insert before </head>
    content = content.replace('</head>', '    <script src="/js/auth.js"></script>\n</head>');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Injected auth.js into', file);
  }
});
