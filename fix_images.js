const fs = require('fs');
const path = require('path');

const frontendDir = path.join(__dirname, 'frontend');
const files = fs.readdirSync(frontendDir).filter(f => f.endsWith('.html'));

const replacements = [
  // Logo
  {
    regex: /https:\/\/lh3\.googleusercontent\.com\/aida-public\/AB6AXuAJH2nOcyxSsVchjtGKaZx3Q44364A80kZAf_LLRxSaaTKETNu0JDU0ZIN2TbQeu8sGgYERCyo2cWUT_e6TAkvHVj-73qRfIHRdZ6A8ZfQQrLGEMRpIH-5HoRouPUJs1qCoi5rVB7V_VBmSwck_RIthiPvM1sdtUmRZ7q4VXgDP94DWOPhgz77nyrnlTeZEyFL3YBeJd1gxQ_S3ey3e2FMDnnYHBZHvHIk1vs4u9r1f2QOSTUnF1EjTiQ/g,
    replacement: 'https://api.dicebear.com/7.x/shapes/svg?seed=BharatCare'
  },
  // User Avatar 1
  {
    regex: /https:\/\/lh3\.googleusercontent\.com\/aida-public\/AB6AXuBAsCO7T9F2LjSSVs157CJ-JaPF6AdWADbdAUWqE3sIuNgY2h1NZk2Xk9Z3QeSBMf2qw8oYiHyyE-h-G6-oRnpMKIZ6MFlPxVomsftvHZo6c2X0duRhELGCKsAk58NrFlRoiCzyH4KOlliGnEuyFztQY1VDEJY2jyMJ52F33dVuIgSq5YljVK0cxOWBIBzayJ7eYDh0CcQmq5JVIII_jk1DDv0ZYRpxfe498CNDYjyfQXT1azRmpIkVEQ/g,
    replacement: 'https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff'
  },
  // User Avatar 2 (Dashboard)
  {
    regex: /https:\/\/lh3\.googleusercontent\.com\/aida-public\/AB6AXuBWOI5yPtQS0DviiYM4pq3xIV0ug7a2V1syxgzbmeflUfv_G9fGwGKvENDOGW2wXqoDgP6nRtP4wox8SZMSKFy8eTwKtTjqwYxutCOZofVfyRv8q81nXDCMYjGfFwiX7sLsNmNwOQY3CVH973nJYnABVakrItYtqBi5mP-FYsBU90CO0Fc917IbasvW3YBBZVfxdIuCtLcKPtwCptXAk9L8tKEzzTAlRD55IOBY1TWv7D48iJHOQpNX-Q/g,
    replacement: 'https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff'
  },
  // Hero Image
  {
    regex: /https:\/\/lh3\.googleusercontent\.com\/aida-public\/AB6AXuALHROgQ5-F6auzLIG5MJ9P80FegD9-MAMxUU5AXPLEUbcaZtQO2JWfwZS2x1ScCmhpCBL2LFRK55R-bHFb49zMTCliRAHPDaOaWHl6b05dRTJDzSVPAvO7YQ5NQsTgWd3rIwR4ZY6Q8uuSXgI9lOBR-lRJZnjhv8TkyjiZ3CCo-WmcSeFfLpKlZoMFlTC32Fq9FgclrHk3nNqaYVvLfroI_7Loz93g-UhQggbPwkyaPdjwTc7a64sRgQ/g,
    replacement: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800'
  },
  // Feature Image
  {
    regex: /https:\/\/lh3\.googleusercontent\.com\/aida-public\/AB6AXuCcE_nl5WhReCSz2cbBGRzstV9C6kA2j3P9iEVfWmj4uueCJjyJtS6Wtv2nr6ARrZIrlyojTn5NzGhiYKM-hcDyT1McBCJujOnku9dh35-a07i8baEzjvr44WaRJwQAnQkr-ijGiO1qmuOFz7qQUbqIfEypqdWxnmj8S6wv1fyM8L_7vtCrHHbbmRLr3s0fkS1TkWzKdXzA45PTLV0hi4fvW9Ob_Z2_gRg-tQhNdRjXf9hoypMZ0A7Hdg/g,
    replacement: 'https://images.unsplash.com/photo-1505664173622-18169dc5a522?auto=format&fit=crop&q=80&w=800'
  },
  // Trusted user 1
  {
    regex: /https:\/\/lh3\.googleusercontent\.com\/aida-public\/AB6AXuCZz0Bys55UgmpqrObju9b9I2ONxZX_MOSv1503RhorlJzxJSWUOtrSzXEV36cxSjBCNVaKqx53MMBInDXOyJXoAsh_J4FmEj6Oes_a2LmY1ILe4PwXjIt-98KRZlBWPbtZAH4cTb-KO1Ss-XUqO_9CXuqtYVo92D7B83YLbQfsQeqzU2v1lh17LJuBEynpJ-hN_YN_tAiPoWs9fSgZkpQDfQ1QZsfPYfh8tFMMdL_3VAkD8zhvPe4DGQ/g,
    replacement: 'https://i.pravatar.cc/100?img=1'
  },
  // Trusted user 2
  {
    regex: /https:\/\/lh3\.googleusercontent\.com\/aida-public\/AB6AXuDvZne3Vqd_q7Ha7gsZ4UG4kWZQbehQuRoWGobCAEIYz0j0SwE9IcrNRNsFlEREgEw3iSYP1BshIOqKyrnvLUihTg1MGgnaJd6PFGwEU_SpCH_YT0iTWxqMBEJZmm1Rjs6r_dB-m_6STzGLutJM0RU7VA_bjiQKac83jhckDzZ7XE-zOw5ytzT7kg6USe85gSUjCyca-0pmo2buj40rXIJevwGfmiuv73EuZAqA4TWKS_yvt7Ayz8oozQ/g,
    replacement: 'https://i.pravatar.cc/100?img=2'
  },
  // Trusted user 3
  {
    regex: /https:\/\/lh3\.googleusercontent\.com\/aida-public\/AB6AXuDexiJ-XfCLvARTklDpfXPwB2urMCbYhbcI5ghMMAtCa-_de3vRpxsRY1QwSA2XlyRq7on7nhehetXA98egyDcbN8PjcQPcbz-GwOwobkCBg-RUTkFw3_fBrX1A6EADlAI0BqITcsCkGohquYc3j56pzNc1Be4Jrduj0ibO-Ht-RjRDI1mO2KGXbmlPmNoMqBiDvm1ADvLIK9IZ861SzOVIZT5LJKLkgNX1Nm52v6q2cS4XC6IZjDY72g/g,
    replacement: 'https://i.pravatar.cc/100?img=3'
  }
];

files.forEach(file => {
  const filePath = path.join(frontendDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  replacements.forEach(r => {
    if (content.match(r.regex)) {
      content = content.replace(r.regex, r.replacement);
      changed = true;
    }
  });

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed images in', file);
  }
});
