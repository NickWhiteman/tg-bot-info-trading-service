import { Telegraf } from 'telegraf';
import { IBotContext } from '../types/interface';

export abstract class AbstractCommand {
  constructor(public bot: Telegraf<IBotContext>) {}

  abstract handle(): void;
}
