const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.get('/', (req, res) => {
  res.json({ status: 'WealthIQ Backend running!' });
});
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        system: 'You are WealthIQ, expert investment analyst. Be direct and helpful.',
        messages: messages
      })
    });
    const data = await response.json();
    res.json({ message: data.content[0].text });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Running on port ' + PORT));
