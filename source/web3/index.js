const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { generateQR } = require('./public/qr');

const app = express();
const PORT = process.env.PORT || 3000;

require('events').EventEmitter.defaultMaxListeners = 500;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// QR code generation route
app.get('/qr', async (req, res) => {
  try {
    await generateQR(req, res);
  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).send('Error generating QR code');
  }
});

// Handle the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;