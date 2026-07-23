import 'dotenv/config';
import qrcode from 'qrcode-terminal';
import { config } from './config.js';
import { handleWhatsAppText, isAllowedSender, type PendingBooking } from './whatsappWebBot.js';

console.log('Carregando whatsapp-web.js...');
const { default: whatsappWeb } = await import('whatsapp-web.js');
const { Client, LocalAuth } = whatsappWeb;
const allowedSenders = splitCsv(process.env.WHATSAPP_ALLOWED_SENDERS ?? '');
const pendingBySender = new Map<string, PendingBooking>();
const chromePath = process.env.WHATSAPP_CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: process.env.WHATSAPP_SESSION_PATH || '.wwebjs_auth',
  }),
  puppeteer: {
    headless: true,
    executablePath: chromePath,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  },
});

client.on('loading_screen', (percent, message) => {
  console.log(`WhatsApp carregando: ${percent}% ${message}`);
});

client.on('qr', (qr) => {
  console.log('Escaneie o QR code no WhatsApp:');
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('WhatsApp Web bot pronto.');
});

client.on('auth_failure', (message) => {
  console.error(`Falha de autenticação WhatsApp: ${message}`);
});

client.on('disconnected', (reason) => {
  console.error(`WhatsApp desconectado: ${reason}`);
});

client.on('message', async (message) => {
  const sender = message.from;
  if (!isAllowedSender(sender, allowedSenders)) return;

  const reply = handleWhatsAppText(message.body, pendingBySender.get(sender), config.booking.preferredCourts);
  if (reply.pending === null) pendingBySender.delete(sender);
  if (reply.pending) pendingBySender.set(sender, reply.pending);

  await message.reply(reply.text);
});

console.log(`Iniciando WhatsApp Web com Chrome: ${chromePath}`);
await client.initialize();

function splitCsv(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}
