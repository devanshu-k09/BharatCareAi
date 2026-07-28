const fs = require('fs');
const path = require('path');

const frontendDir = path.join(__dirname, 'frontend');

let profileFile = path.join(frontendDir, 'profile.html');
let profileContent = fs.readFileSync(profileFile, 'utf8');

profileContent = profileContent.replace('value="Advait Sharma"', 'id="profile-name-input" value=""');
profileContent = profileContent.replace('value="advait.sharma@example.com"', 'id="profile-email-input" value=""');

profileContent = profileContent.replace('</body>', `
<script>
  document.addEventListener('DOMContentLoaded', () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        const nameInput = document.getElementById('profile-name-input');
        if (nameInput) nameInput.value = user.name || '';
        
        const emailInput = document.getElementById('profile-email-input');
        if (emailInput) emailInput.value = user.email || '';
      }
    } catch(e) { console.error(e); }
  });
</script>
</body>`);

fs.writeFileSync(profileFile, profileContent);
console.log("Fixed profile.html");
