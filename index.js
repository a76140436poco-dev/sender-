const express = require('express');
const { TelegramBot } = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');

// --- تنظیمات دستی (توکن و آیدی را اینجا وارد کنید) ---
const BOT_TOKEN = 'توکن_رزدی_توی_بات_فادر';
const ADMIN_ID = 'آیدی_تلفن_خودت';
const PORT = 3000;

const app = express();
app.use(express.json());

// تنظیم پنل
app.use(express.static(path.join(__dirname, 'public')));

// --- تنظیم ربات تلگرام ---
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// --- تنظیمات سوشرز پلاس ---
let soroushClient = null;
let sessionData = '';

// بررسی وجود سشن
if (fs.existsSync(path.join(__dirname, 'session.session'))) {
 sessionData = fs.readFileSync(path.join(__dirname, 'session.session'), 'utf8');
}

const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');
const apiId = 12345678; // عدد API ID
const apiHash = 'your_api_hash_here'; // رشته API Hash

async function connectSoroush() {
 console.log('Connecting to Soroush Plus...');
 
 const client = new TelegramClient(new StringSession(sessionData), apiId, apiHash, {
 connectionRetries: 5,
 });

 try {
 if (!sessionData) {
 console.log('No session found. Logging in...');
 await client.start({
 phoneNumber: async () => await require('input').text('شماره موبایل را وارد کنید: '),
 password: async () => await require('input').text('رمز عبور را وارد کنید: '),
 phoneCode: async () => await require('input').text('کد تایید را وارد کنید: '),
 });
 fs.writeFileSync(path.join(__dirname, 'session.session'), sessionData);
 } else {
 console.log('Session found. Connecting...');
 await client.connect();
 }
 soroushClient = client;
 } catch (err) {
 console.error('Error connecting to Soroush:', err);
 }
}

connectSoroush();

// --- مسیرهای API ---

app.get('/', (req, res) => {
 res.sendFile(path.join(__dirname, 'public/index.html'));
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

app.listen(PORT, () => {
 console.log(`Server is running on port ${PORT}`);
});
