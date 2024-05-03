import { Context } from 'telegraf';

type CurrencyType = { free: number; used: number; total: number };
type CurrencyStateType = { BTC: number; OKB: number; ETH: number; USDT: number };
export type BalanceType = {
  info: { code: string; data: any[]; msg: string };
  BTC: CurrencyType;
  OKB: CurrencyType;
  ETH: CurrencyType;
  USDT: CurrencyType;
  timestamp: number;
  datetime: string;
  free: CurrencyStateType;
  used: CurrencyStateType;
  total: CurrencyStateType;
};

export interface ISessionData {
  balance: BalanceType;
}

export interface IBotContext extends Context {
  session: ISessionData;
}
