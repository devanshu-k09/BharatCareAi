import { GoogleGenAI } from '@google/genai';
import { v4 as uuidv4 } from 'uuid';
import db from '../config/db.js';

export const generateComplaintDraft = async (req, res) => {
  const { type, details } = req.body;
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      return res.status(500).json({ message: 'Gemini API Key not configured. Please add your GEMINI_API_KEY in backend/.env' });
    }
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `Draft a formal, professional ${type} complaint letter suitable for submission in India.
User Details/Context: ${details}
Use proper placeholders like [Your Full Name], [Date], [Address], [Authority Name].
The tone must be formal and the letter ready to print or submit. Output only the letter text.`;

    const result = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: prompt
    });
    const draft = result.text;

    const complaint = {
      _id: uuidv4(),
      user: req.user._id,
      type,
      details,
      generatedDraft: draft,
      createdAt: new Date().toISOString()
    };

    const data = db.data;
    data.complaints.push(complaint);
    db.write(data);

    res.json(complaint);
  } catch (error) {
    console.error('Complaint error:', error);
    res.status(500).json({ message: 'Error generating complaint: ' + error.message });
  }
};

export const getUserComplaints = (req, res) => {
  const complaints = db.data.complaints
    .filter(c => c.user === req.user._id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(complaints);
};
