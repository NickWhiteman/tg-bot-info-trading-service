import { Order } from 'ccxt';

export type OrderType = {
  id: number;
  orderId: string;
  order: Order;
  createAt: number;
  price: number;
  amount: number;
  side: 'buy' | 'sell';
  symbol: string;
  isActive: number;
};

export type CreateOrderParamsType = Pick<OrderType, 'orderId' | 'order' | 'price' | 'amount' | 'side' | 'symbol'> & {
  indexOperation: string;
};

export type TableNameType = 'trade_operation' | 'balance_history';
export type ValueType = {
  column: string;
  value: string | number;
};
type WhereType = ValueType;

export type UpdateQueryParamType = {
  tableName: TableNameType;
  value: ValueType[];
  where: WhereType[];
  operationCondition?: 'and' | 'or';
};

export type InsertQueryParamType = Pick<UpdateQueryParamType, 'tableName'> & {
  value: ValueType[];
};

export type SelectQueryParamType = Pick<UpdateQueryParamType, 'tableName' | 'where' | 'operationCondition'> & {
  column: string[];
};

export type WhereGenerationParamType = Pick<UpdateQueryParamType, 'operationCondition' | 'where'>;
export type ValueGenerationParamType = ValueType;

export type CreateStateBalanceParamType = {
  usdt: number;
  eth: number;
  profitSession: number;
  profitAll: number;
  exchangeName: string;
  updateDate?: number;
  profitEth: number;
  profitUsdt: number;
  profitPercent: number;
  apiKey: string;
  privateKey: string;
};

export type BalanceStateType = Omit<
  CreateStateBalanceParamType,
  'apiKey' | 'privateKey' | 'exchangeName' | 'updateDate'
>;

export enum ColumnName {
  //balance_history
  usdt = 'usdt',
  eth = 'eth',
  profitSession = 'profit_session',
  profitAll = 'profit_all',
  exchangeName = 'exchange_name',
  updateDate = 'update_date',
  profitEth = 'profit_eth',
  profitUsdt = 'profit_usdt',
  profitPercent = 'profit_percent',
  apiKey = 'api_key',
  privateKey = 'private_key',
  //trading_operation
  symbol = 'symbol',
  orderId = 'order_id',
  order = '"order"',
  price = 'price',
  amount = 'amount',
  side = 'side',
  indexOperation = 'index_operation',
}
