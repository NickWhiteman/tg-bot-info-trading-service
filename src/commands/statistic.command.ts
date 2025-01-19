import { config } from 'dotenv';
import { Markup, Telegraf } from 'telegraf';
import { IBotContext } from '../types/interface';
import { AbstractCommand } from './abstract.command';
import { OrderRepository, BalanceRepository, SessionRepository } from 'repository';
config();

export class StatisticCommand extends AbstractCommand {
  constructor(
    bot: Telegraf<IBotContext>,
    private balanceRepository: BalanceRepository,
    private orderRepository: OrderRepository,
    private sessionRepository: SessionRepository,
  ) {
    super(bot);
  }
  async handle(): Promise<void> {
    this.bot.action('allOpenPosition', async (ctx) => {
      console.log(`responce => allOpenPosition`);
      const orders = await this.orderRepository.getAllActiveOrders();

      if (!orders?.length || orders === undefined) {
        ctx.reply('Not open orders!');
        return;
      }

      for (const order of orders) {
        await ctx.reply(`Order ${order.orderId}
              Amount: ${order.amount}
              Price: ${order.price}
              Side: ${order.side}
              Symbol: ${order.symbol}
            `);
      }
    });

    this.bot.action('getBalance', async (ctx) => {
      console.log('balance => ', 'this work');
      const balance = await this.balanceRepository.getBalanceByApiKey()!;
      const profitSession = await this.sessionRepository.getAllSessionProfit();

      console.log('balance => ', balance);
      ctx.reply(
        balance
          ? `
        USDT: ${balance?.usdt}
        Profit USDT: ${balance['profitusdt']}
        All profit: ${profitSession}
        Profit percent: ${balance['profitpercent']}`
          : 'Connection not found!',
      );
    });

    this.bot.action('allProfit', async (ctx) => {
      console.log(`responce => allProfit`);

      const allProfit = await this.sessionRepository.getAllSessionProfit();
      await ctx.reply(`All profit: ${allProfit}`);
    });

    this.bot.action('checkActive', async (ctx) => {
      const session = await this.sessionRepository.checkingActiveSession();
      console.log(`responce => checkActive`);
      await ctx.reply(
        session ? `Session index: ${session?.indexSession}, Is active: ${session?.isActive}` : `Not started session!`,
      );
    });
  }
}
