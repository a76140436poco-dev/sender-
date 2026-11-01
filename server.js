require('dotenv').config();
const express = require('express');
const app = express();
const { TelegramBot } = require('node-telegram-bot-api');

app.use(express.json());
app.use(express.static('public'));

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

app.get('/', (req, res) => {
 res.sendFile(__dirname + '/public/index.html');
});

app.get('/api/stats', (req, res) => {
 res.json({ status: 'running', version: '1.0' });
});

app.post('/api/send', async (req, res) => {
 const { message, chatId } = req.body;
 
 try {
 await bot.sendMessage(chatId, message);
 res.json({ success: true });
 } catch (err) {
 res.status(500).json({ success: false, error: err.message });
 }
});

app.listen(process.env.PORT || 3000, () => {
 console.log(`Server is running on port ${process.env.PORT}`);
});