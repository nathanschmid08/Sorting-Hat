import express from 'express';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const app = express();
const port = 3000;

// Für __dirname Unterstützung mit ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static('public'));
app.use(express.json());

let chatHistory = [
  { role: "system", content: "You are the Hogwarts Sorting Hat. Speak in a wise, cryptic, and poetic tone. Ask the user thoughtful questions to learn about their personality, then decide which of the four Hogwarts houses suits them best: Gryffindor, Hufflepuff, Ravenclaw, or Slytherin. Stay completely in character, and refer to yourself as 'the Sorting Hat'." }
];

app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: 'Message required' });
  }

  // Push user message
  chatHistory.push({ role: "user", content: userMessage });

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: chatHistory
    });

    const reply = completion.choices[0].message.content;

    // Add AI response to history
    chatHistory.push({ role: "assistant", content: reply });

    res.json({ reply });
  } catch (err) {
    console.error('OpenAI API error:', err);
    res.status(500).json({ error: 'Failed to contact OpenAI' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
