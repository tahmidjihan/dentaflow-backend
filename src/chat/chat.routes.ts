import { Router, type Request, type Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

const SYSTEM_PROMPT = `You are DentaBot, a friendly and knowledgeable dental assistant chatbot for DentaWave, a modern dental clinic management platform. 

Your role:
- Answer common dental health questions
- Help users understand dental procedures and treatments
- Guide users on how to use the DentaWave platform (booking appointments, finding clinics/doctors, managing profiles)
- Provide oral hygiene tips and preventive care advice
- Recommend when a user should see a dentist

Guidelines:
- Be warm, professional, and concise
- Keep responses under 3-4 sentences unless more detail is needed
- Use simple language a patient can understand
- Always remind users to book an appointment for serious concerns
- Never give medical diagnoses - always recommend seeing a dentist
- If asked about non-dental topics, politely redirect to dental topics

Platform features you can help with:
- Book appointments online
- Browse clinics and doctors
- View appointment history
- Manage your profile
- Access dental health resources`;

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatRequestBody {
  messages: ChatMessage[];
  stream?: boolean;
}

router.post('/chat', async (req: Request, res: Response) => {
  try {
    const { messages }: ChatRequestBody = req.body;

    if (!messages || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'OpenRouter API key not configured' });
    }

    // Prepend system prompt
    const allMessages: ChatMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages,
    ];

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://dentaflow-rho.vercel.app',
        'X-Title': 'DentaWave Dental Assistant',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-exp:free',
        messages: allMessages,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenRouter API error:', errorData);
      return res.status(response.status).json({
        error: 'Failed to get AI response',
        details: errorData,
      });
    }

    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content || 'Sorry, I could not process your request. Please try again.';

    return res.json({
      role: 'assistant',
      content: assistantMessage,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
