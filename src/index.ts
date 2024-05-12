import { TelegramBot } from './TelegramBot';
try {
  const bot = new TelegramBot();
  bot.init();
  console.log('Bot started!');
} catch (error) {
  console.error(error);
}
