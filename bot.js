const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');
const input = require('input');
const fs = require('fs');
const path = require('path');

const apiId = process.env.SOURASH_API_ID;
const apiHash = process.env.SOURASH_API_HASH;
const SESSION_PATH = path.join(__dirname, '..', 'session.session');

async function startBot() {
 console.log('در حال شروع RABOT Soroush Plus...');
 
 let sessionStr = '';
 if (fs.existsSync(SESSION_PATH)) {
 sessionStr = fs.readFileSync(SESSION_PATH, 'utf8');
 }

 const client = new TelegramClient(new StringSession(sessionStr), apiId, apiHash, {
 connectionRetries: 5,
 });

 try {
 if (!sessionStr) {
 console.log('ورود به اکانت سوشرز پلاس...');
 await client.start({
 phoneNumber: async () => await input.text('شماره موبایل را وارد کنید: '),
 password: async () => await input.text('رمز عبور را وارد کنید: '),
 phoneCode: async () => await input.text('کد تایید را وارد کنید: '),
 });
 await client.saveSession(SESSION_PATH);
 console.log('✅ لاگین موفقیت آمیز بود.');
 } else {
 console.log('سشن موجود است. کانکشن برقرار شد.');
 await client.connect();
 }

 } catch (err) {
 console.error('خطا در لاگین:', err);
 return;
 }

 async function scanLinkDoni(link) {
 console.log(`اسکن لینکدونی: ${link}`);
 try {
 const entity = await client.getEntity(link);
 console.log(`گروه یافت شد: ${entity.title}`);
 return entity;
 } catch (e) {
 console.log('خطا در پیدا کردن گروه');
 return null;
 }
 }

 async function sendToGroup(entity, message) {
 await client.sendMessage(entity, { message });
 console.log(`پیام ارسال شد به ${entity.title}`);
 }

 async function scanAllLinkDoni() {
 const dialogs = await client.getDialogs();
 const linkDoniGroups = dialogs.filter(d => d.entity.className === 'Channel' && d.entity.username.includes('linkdoni'));

 for (const dialog of linkDoniGroups) {
 await sendToGroup(dialog.entity, 'پیام تست سندر ربات سوشرز پلاس');
 await new Promise(r => setTimeout(r, 2000));
 }
 }

 client.addEventHandler(async (event) => {
 const msg = event.message;
 
 if (msg.text.startsWith('/scan')) {
 const link = msg.text.replace('/scan', '').trim();
 const group = await scanLinkDoni(link);
 if (group) {
 bot.sendMessage(msg.chatId, `گروه یافت شد! ${group.title}`);
 }
 }

 if (msg.text.startsWith('/send')) {
 const text = msg.text.replace('/send', '').trim();
 const targetGroup = await client.getEntities([(-100123456)]); 
 await sendToGroup(targetGroup[0], text);
 bot.sendMessage(msg.chatId, 'پیام سندر ارسال شد.');
 }
 
 }, new events.NewMessage({ incoming: true, outgoing: false }));

 console.log('ربات در حال اجراست...');
}

startBot().catch(console.error);