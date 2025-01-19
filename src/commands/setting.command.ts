import { config } from 'dotenv';
import { Markup, Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import { IBotContext } from '../types/interface';
import { AbstractCommand } from './abstract.command';
import { SessionRepository, ConfigRepository } from '../repository';
config();

export class SettingCommand extends AbstractCommand {
  constructor(
    bot: Telegraf<IBotContext>,
    private sessionRepository: SessionRepository,
    private configRepository: ConfigRepository,
  ) {
    super(bot);
  }
  async handle(): Promise<void> {
    this.bot.action('enableEmergency', async (ctx) => {
      await this.configRepository.enableEmergencyStop();
      console.log(`responce => enableEmergency`);
      await ctx.reply(`Process is stoped!`);
    });

    this.bot.action('changeConfig', async (ctx) => {
      this.bot.on(message('text'), async (ctx) => {
        try {
          const newConfig = JSON.parse(ctx.message.text);
          await this.configRepository.updateConfig(newConfig);
          await ctx.reply('Config saved successfully!');
        } catch (error) {
          console.log(error);
        }
      });
      console.log(`responce => changeConfig`);
      await ctx.reply(`Insert config data next message.`);
    });
  }
}
