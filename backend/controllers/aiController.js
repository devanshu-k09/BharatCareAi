import { GoogleGenAI } from '@google/genai';
import { v4 as uuidv4 } from 'uuid';
import db from '../config/db.js';
import { createServerActivity } from '../utils/activityHelper.js';

export const generateLegalAdvice = async (req, res) => {
  const { prompt, chatId } = req.body;
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      return res.status(500).json({ message: 'Gemini API Key not configured. Please add your GEMINI_API_KEY in backend/.env' });
    }
    const ai = new GoogleGenAI({ apiKey });

    if (req.user && req.user._id) {
      const summary = prompt ? (prompt.length > 40 ? prompt.substring(0, 40) + '...' : prompt) : 'Asked legal question';
      createServerActivity(req.user._id, 'AI Question Asked', summary, 'smart_toy', 'ai');
    }

    const systemPrompt = `You are BharatCare AI, a friendly government help assistant for common Indian citizens (not for lawyers).
The user does not understand legal jargon, so you MUST use simple, everyday English.
User query: "${prompt}"

When responding, follow these rules strictly:
- Be friendly, reassuring, and step-by-step.
- Explain the situation in simple words and tell the user what rights they have.
- Mention relevant Indian laws only as supporting information, and explain what they mean practically rather than quoting section numbers.
- Tell them exactly what to do next and what documents to gather.
- Recommend the appropriate government department or authority (provide links or contact info if available).

Structure your response simply:
1. **Understanding Your Problem**
2. **Your Rights (In Simple Words)**
3. **What the Law Says (Briefly)**
4. **What You Should Do Now (Step-by-Step)**
5. **Documents to Keep Handy**
6. **Where to Complain (Government Office/Portal)**
7. **⚠️ Note:** This information is for guidance and education, not a substitute for professional legal advice.`;

    console.log(`[API LOG] Dispatching Gemini API Request...`);
    console.log(`[API LOG] Gemini Model: gemini-3.1-flash-lite`);
    console.log(`[API LOG] Gemini System Prompt snippet: ${systemPrompt.substring(0, 100)}...`);
    if (req.file) {
      console.log(`[API LOG] Gemini Multimodal attachment size: ${req.file.size} bytes, type: ${req.file.mimetype}`);
    }

    const result = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: [
          {
            role: 'user',
            parts: [
              { text: systemPrompt },
              ...(req.file ? [{
                inlineData: {
                  mimeType: req.file.mimetype,
                  data: req.file.buffer.toString('base64')
                }
              }] : [])
            ]
          }
        ]
    });
    
    const aiResponse = result.text;
    console.log(`[API LOG] Gemini API Response received successfully.`);
    console.log(`[API LOG] Gemini Response snippet: ${aiResponse.substring(0, 100)}...`);

    const data = db.data;
    const userSettings = req.user.settings || {};
    const shouldSaveHistory = userSettings.saveSearchHistory !== false;

    let responseChatId = chatId || uuidv4();

    if (shouldSaveHistory) {
      console.log(`[API LOG] Executing LowDB Query: Finding active chat by ID "${chatId}" for user "${req.user._id}"`);
      let chat = chatId ? data.chats.find(c => c._id === chatId && c.user === req.user._id) : null;

      if (chat) {
        console.log(`[API LOG] Appending messages to existing chat ID "${chat._id}"`);
        chat.messages.push({ role: 'user', content: prompt });
        chat.messages.push({ role: 'ai',   content: aiResponse });
        chat.updatedAt = new Date().toISOString();
        responseChatId = chat._id;
      } else {
        console.log(`[API LOG] Creating a new chat thread for user "${req.user._id}"`);
        chat = {
          _id: uuidv4(),
          user: req.user._id,
          title: prompt.substring(0, 50) + (prompt.length > 50 ? '...' : ''),
          messages: [
            { role: 'user', content: prompt },
            { role: 'ai',   content: aiResponse }
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        data.chats.push(chat);
        responseChatId = chat._id;
      }

      console.log(`[API LOG] Writing updates to db.json...`);
      db.write(data);
    } else {
      console.log(`[API LOG] Search history logging is disabled by user settings.`);
    }
    
    console.log(`[API LOG] Sending Final Response: HTTP 200 OK`);
    res.json({ aiResponse, chatId: responseChatId });
  } catch (error) {
    console.error('[API LOG] AI Request processing failed. Error:', error);
    res.status(500).json({ message: 'Failed to process AI Request: ' + error.message });
  }
};

export const getUserChats = (req, res) => {
  const chats = db.data.chats
    .filter(c => c.user === req.user._id)
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  res.json(chats);
};

export const deleteChat = (req, res) => {
  const data = db.data;
  data.chats = data.chats.filter(c => !(c._id === req.params.id && c.user === req.user._id));
  db.write(data);
  res.json({ message: 'Chat deleted' });
};
