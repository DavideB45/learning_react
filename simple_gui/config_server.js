const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3001;
const CONFIG_FILE = path.join(__dirname, 'robot-config.json');

app.use(cors());
app.use(express.json());

// Read configuration
app.get('/api/config', async (req, res) => {
  try {
    const data = await fs.readFile(CONFIG_FILE, 'utf-8');
    res.json(JSON.parse(data));
  } catch (error) {
    // File doesn't exist yet
    res.json({ robotType: '', algorithm: '' });
  }
});

// Save configuration
app.post('/api/config', async (req, res) => {
  try {
    await fs.writeFile(CONFIG_FILE, JSON.stringify(req.body, null, 2));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save configuration' });
  }
});

app.listen(PORT, () => {
  console.log(`🤖 Configuration server running on http://localhost:${PORT}`);
});