const API_BASE_URL = window.location.protocol === 'file:' ? 'http://localhost:5000' : '';

document.addEventListener('DOMContentLoaded', () => {
  const chatForm = document.getElementById('chat-input');
  const sendBtn = document.getElementById('send-btn');
  const chatBox = document.getElementById('chat-box');
  let currentChatId = null;

  sendBtn.addEventListener('click', async () => {
    const prompt = chatForm.value.trim();
    if (!prompt) return;

    // Add User Message
    chatBox.innerHTML += `<div class="message msg-user shadow-sm">${prompt}</div>`;
    chatForm.value = '';
    
    // Scroll to bottom
    chatBox.scrollTop = chatBox.scrollHeight;

    // Add Loading Bubble
    const loadingId = 'loading-' + Date.now();
    chatBox.innerHTML += `<div id="${loadingId}" class="message msg-ai shadow-sm"><i class="fa-solid fa-spinner fa-spin"></i> Analyzing your case...</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
      const res = await fetch(`${API_BASE_URL}/api/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ prompt, chatId: currentChatId })
      });
      
      const data = await res.json();
      document.getElementById(loadingId).remove();
      
      if (res.ok) {
        currentChatId = data.chatId;
        chatBox.innerHTML += `<div class="message msg-ai shadow-sm">${marked.parse(data.aiResponse)}</div>`;
      } else {
        chatBox.innerHTML += `<div class="message msg-ai shadow-sm text-danger">Error: ${data.message}</div>`;
      }
    } catch (error) {
      document.getElementById(loadingId).remove();
      chatBox.innerHTML += `<div class="message msg-ai shadow-sm text-danger">Network error occurred.</div>`;
    }
    
    chatBox.scrollTop = chatBox.scrollHeight;
  });

  // Allow Enter key
  chatForm.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      sendBtn.click();
    }
  });
});
