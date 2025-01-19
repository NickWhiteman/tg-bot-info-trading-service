import { config } from 'dotenv';
import { Markup, Telegraf } from 'telegraf';
import { IBotContext } from '../types/interface';
import { AbstractCommand } from './abstract.command';
config();

export class StartCommand extends AbstractCommand {
  constructor(bot: Telegraf<IBotContext>) {
    super(bot);
  }
  async handle(): Promise<void> {
    this.bot.action('/statistic', async (ctx) => {
      await ctx.reply(
        '𝗦𝗧𝗔𝗧𝗜𝗦𝗧𝗜𝗖 𝗜𝗻𝘁𝗲𝗿𝗳𝗮𝗰𝗲',
        Markup.inlineKeyboard([
          Markup.button.callback('Get balance', 'getBalance'),
          Markup.button.callback('All open position', 'allOpenPosition'),
          Markup.button.callback('Check active session', 'checkActive'),
          Markup.button.callback('Check all profit', 'allProfit'),
        ]),
      );
    });

    this.bot.action('/setting', async (ctx) => {
      await ctx.reply(
        '𝗦𝗘𝗧𝗧𝗜𝗡𝗚 𝗜𝗻𝘁𝗲𝗿𝗳𝗮𝗰𝗲',
        Markup.inlineKeyboard([
          Markup.button.callback('Change config', 'changeConfig'),
          Markup.button.callback('Emergency stop', 'enableEmergency'),
        ]),
      );
    });

    this.bot.start(async (ctx) => {
      await ctx.reply(
        '𝗔𝗟𝗚𝗢𝗕𝗢𝗧 𝗜𝗻𝘁𝗲𝗿𝗳𝗮𝗰𝗲',
        Markup.inlineKeyboard([
          Markup.button.callback('Statistic', '/statistic'),
          Markup.button.callback('Setting', '/setting'),
        ]),
      );
    });
  }
}
