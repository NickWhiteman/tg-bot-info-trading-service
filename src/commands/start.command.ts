import { config } from 'dotenv';
import { Markup, Telegraf } from 'telegraf';
import { IBotContext } from '../types/interface';
import { AbstractCommand } from './abstract.command';
import { OrderRepository, BalanceRepository, SessionRepository } from 'repository';
config();

export class StartCommand extends AbstractCommand {
  constructor(
    bot: Telegraf<IBotContext>,
    private balanceRepository: BalanceRepository,
    private orderRepository: OrderRepository,
    private sessionRepository: SessionRepository,
  ) {
    super(bot);
  }
  async handle(): Promise<void> {
    this.bot.start(async (ctx) => {
      await ctx.reply(
        'AlgoBot Interface',
        Markup.inlineKeyboard([
          Markup.button.callback('Get balance', 'getBalance'),
          Markup.button.callback('All open position', 'allOpenPosition'),
          Markup.button.callback('Start trade', 'startTrade'),
          Markup.button.callback('Check active session', 'checkActive'),
          Markup.button.callback('Change config', 'changeConfig'),
        ]),
      );
    });

    this.bot.action('allOpenPosition', async (ctx) => {
      const orders = await this.orderRepository.getAllActiveOrders();

      if (orders?.length || orders === undefined) {
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
      const balance = await this.balanceRepository.getBalanceByApiKey(process.env.API_KEY!)!;
      const profitSession = await this.sessionRepository.getAllSessionProfit();
      console.log('balance => ', balance);
      await ctx.reply(
        balance
          ? ` ETH: ${balance?.eth}
        USDT: ${balance?.usdt}
        Profit ETH: ${balance['profiteth']}
        Profit USDT: ${balance['profitusdt']}
        All balance: ${balance.profitAll}
        Profit percent: ${balance['profitpercent']}
        Profit prev session: ${profitSession}`
          : 'Connection not found!',
      );
    });

    this.bot.action('startTrade', async (ctx) => {
      await fetch('http://0.0.0.0:3001/start');
      const indexSession = await this.sessionRepository.checkingActiveSession();
      await ctx.reply(`Trading session start! ${indexSession?.indexSession}`);
    });

    this.bot.action('allProfit', async (ctx) => {
      const allProfit = await this.sessionRepository.getAllSessionProfit();
      await ctx.reply(`All profit: ${allProfit}`);
    });

    this.bot.action('checkActive', async (ctx) => {
      const session = await this.sessionRepository.checkingActiveSession();
      await ctx.reply(
        session
          ? `
      Session index: ${session?.indexSession}
      Is active: ${session?.isActive}
      `
          : `Not started session!`,
      );
    });

    this.bot.action('changeConfig', async (ctx) => {
      const allProfit = await this.sessionRepository.getAllSessionProfit();
      await ctx.reply(`All profit: ${allProfit}`);
    });
  }
}
