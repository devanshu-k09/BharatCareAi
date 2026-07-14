import { GoogleGenAI } from '@google/genai';

export const legalAssistant = async (req, res) => {
  const { query } = req.body;
  
  if (!query) {
    return res.status(400).json({ success: false, message: 'Query is required.' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      return res.status(500).json({ success: false, message: 'Gemini API Key not configured in backend/.env' });
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `You are BharatCare AI, an Indian legal awareness assistant.

Your responsibilities:
- Explain legal rights in simple English.
- Focus only on Indian laws.
- Classify the legal issue.
- Mention relevant rights and laws where applicable.
- Suggest practical next steps.
- Mention government authorities or official resources if relevant.
- Never claim to be a lawyer.
- Never provide false legal information.
- If uncertain, clearly say so.
- End every response with:

'This information is for educational purposes only and is not legal advice.'`;

    const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: query,
        config: {
            systemInstruction: systemInstruction,
        }
    });

    res.json({
        success: true,
        answer: response.text
    });

  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ success: false, message: 'Failed to process request: ' + error.message });
  }
};
