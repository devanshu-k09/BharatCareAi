import { GoogleGenAI } from '@google/genai';
import { v4 as uuidv4 } from 'uuid';
import db from '../config/db.js';

export const generateLegalAdvice = async (req, res) => {
  const { prompt, chatId } = req.body;
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      return res.status(500).json({ message: 'Gemini API Key not configured. Please add your GEMINI_API_KEY in backend/.env' });
    }
    const ai = new GoogleGenAI({ apiKey });

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

    const data = db.data;
    let chat = chatId ? data.chats.find(c => c._id === chatId && c.user === req.user._id) : null;

    if (chat) {
      chat.messages.push({ role: 'user', content: prompt });
      chat.messages.push({ role: 'ai',   content: aiResponse });
      chat.updatedAt = new Date().toISOString();
    } else {
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
    }

    db.write(data);
    res.json({ aiResponse, chatId: chat._id });
  } catch (error) {
    console.error('AI error:', error);
    res.status(500).json({ message: 'AI Error: ' + error.message });
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
