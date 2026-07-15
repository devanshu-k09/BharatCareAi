const fs = require('fs');
const path = require('path');

const frontendDir = path.join(__dirname, 'frontend');

const replacements = {
  // Logo
  'AB6AXuAJH2nOcyxSsVchjtGKaZx3Q44364A80kZAf_LLRxSaaTKETNu0JDU0ZIN2TbQeu8sGgYERCyo2cWUT_e6TAkvHVj-73qRfIHRdZ6A8ZfQQrLGEMRpIH-5HoRouPUJs1qCoi5rVB7V_VBmSwck_RIthiPvM1sdtUmRZ7q4VXgDP94DWOPhgz77nyrnlTeZEyFL3YBeJd1gxQ_S3ey3e2FMDnnYHBZHvHIk1vs4u9r1f2QOSTUnF1EjTiQ': 'https://ui-avatars.com/api/?name=BC&background=0D47A1&color=fff&size=128',
  
  // Profile avatar
  'AB6AXuBAsCO7T9F2LjSSVs157CJ-JaPF6AdWADbdAUWqE3sIuNgY2h1NZk2Xk9Z3QeSBMf2qw8oYiHyyE-h-G6-oRnpMKIZ6MFlPxVomsftvHZo6c2X0duRhELGCKsAk58NrFlRoiCzyH4KOlliGnEuyFztQY1VDEJY2jyMJ52F33dVuIgSq5YljVK0cxOWBIBzayJ7eYDh0CcQmq5JVIII_jk1DDv0ZYRpxfe498CNDYjyfQXT1azRmpIkVEQ': 'https://ui-avatars.com/api/?name=User&background=random',
  
  // Dashboard avatar
  'AB6AXuBWOI5yPtQS0DviiYM4pq3xIV0ug7a2V1syxgzbmeflUfv_G9fGwGKvENDOGW2wXqoDgP6nRtP4wox8SZMSKFy8eTwKtTjqwYxutCOZofVfyRv8q81nXDCMYjGfFwiX7sLsNmNwOQY3CVH973nJYnABVakrItYtqBi5mP-FYsBU90CO0Fc917IbasvW3YBBZVfxdIuCtLcKPtwCptXAk9L8tKEzzTAlRD55IOBY1TWv7D48iJHOQpNX-Q': 'https://ui-avatars.com/api/?name=Admin&background=random',
  
  // Trusted user avatars
  'AB6AXuCZz0Bys55UgmpqrObju9b9I2ONxZX_MOSv1503RhorlJzxJSWUOtrSzXEV36cxSjBCNVaKqx53MMBInDXOyJXoAsh_J4FmEj6Oes_a2LmY1ILe4PwXjIt-98KRZlBWPbtZAH4cTb-KO1Ss-XUqO_9CXuqtYVo92D7B83YLbQfsQeqzU2v1lh17LJuBEynpJ-hN_YN_tAiPoWs9fSgZkpQDfQ1QZsfPYfh8tFMMdL_3VAkD8zhvPe4DGQ': 'https://ui-avatars.com/api/?name=1&background=random',
  'AB6AXuDvZne3Vqd_q7Ha7gsZ4UG4kWZQbehQuRoWGobCAEIYz0j0SwE9IcrNRNsFlEREgEw3iSYP1BshIOqKyrnvLUihTg1MGgnaJd6PFGwEU_SpCH_YT0iTWxqMBEJZmm1Rjs6r_dB-m_6STzGLutJM0RU7VA_bjiQKac83jhckDzZ7XE-zOw5ytzT7kg6USe85gSUjCyca-0pmo2buj40rXIJevwGfmiuv73EuZAqA4TWKS_yvt7Ayz8oozQ': 'https://ui-avatars.com/api/?name=2&background=random',
  'AB6AXuDexiJ-XfCLvARTklDpfXPwB2urMCbYhbcI5ghMMAtCa-_de3vRpxsRY1QwSA2XlyRq7on7nhehetXA98egyDcbN8PjcQPcbz-GwOwobkCBg-RUTkFw3_fBrX1A6EADlAI0BqITcsCkGohquYc3j56pzNc1Be4Jrduj0ibO-Ht-RjRDI1mO2KGXbmlPmNoMqBiDvm1ADvLIK9IZ861SzOVIZT5LJKLkgNX1Nm52v6q2cS4XC6IZjDY72g': 'https://ui-avatars.com/api/?name=3&background=random',
  
  // AI Legal Assistant interface
  'AB6AXuALHROgQ5-F6auzLIG5MJ9P80FegD9-MAMxUU5AXPLEUbcaZtQO2JWfwZS2x1ScCmhpCBL2LFRK55R-bHFb49zMTCliRAHPDaOaWHl6b05dRTJDzSVPAvO7YQ5NQsTgWd3rIwR4ZY6Q8uuSXgI9lOBR-lRJZnjhv8TkyjiZ3CCo-WmcSeFfLpKlZoMFlTC32Fq9FgclrHk3nNqaYVvLfroI_7Loz93g-UhQggbPwkyaPdjwTc7a64sRgQ': 'https://placehold.co/800x400/1565C0/FFFFFF?text=AI+Legal+Assistant',
  
  // Contextual AI Legal Advice
  'AB6AXuCcE_nl5WhReCSz2cbBGRzstV9C6kA2j3P9iEVfWmj4uueCJjyJtS6Wtv2nr6ARrZIrlyojTn5NzGhiYKM-hcDyT1McBCJujOnku9dh35-a07i8baEzjvr44WaRJwQAnQkr-ijGiO1qmuOFz7qQUbqIfEypqdWxnmj8S6wv1fyM8L_7vtCrHHbbmRLr3s0fkS1TkWzKdXzA45PTLV0hi4fvW9Ob_Z2_gRg-tQhNdRjXf9hoypMZ0A7Hdg': 'https://placehold.co/800x400/E3F2FD/1565C0?text=Contextual+AI+Legal+Advice'
};

const files = fs.readdirSync(frontendDir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const filePath = path.join(frontendDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  
  Object.keys(replacements).forEach(key => {
    const searchUrl = 'https://lh3.googleusercontent.com/aida-public/' + key;
    if (content.includes(searchUrl)) {
      content = content.split(searchUrl).join(replacements[key]);
      changed = true;
    }
  });
  
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed images in ' + file);
  }
});
