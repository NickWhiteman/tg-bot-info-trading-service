import { config } from 'dotenv';
import { Telegraf } from 'telegraf';
import LocalSession from 'telegraf-session-local';
import { IBotContext } from './types/interface';
import { AbstractCommand } from './commands/abstract.command';
import { StartCommand } from './commands/start.command';
import { BalanceRepository, OrderRepository } from './repository';
config();

export class TelegramBot {
  private _bot: Telegraf<IBotContext>;
  private _commands: AbstractCommand[];
  constructor() {
    this._bot = new Telegraf<IBotContext>(process.env.TELEGRAM_BOT!);
    this._bot.use(new LocalSession({ database: 'sessions.json' }));
    this._commands = [new StartCommand(this._bot, new BalanceRepository(), new OrderRepository())];
  }

  async init() {
    for (const command of this._commands) {
      command.handle();
    }
    await this._bot.launch();
  }
}
