import { BalanceStateType, TableNameType } from 'repository/types/types';
import { AbstractRepository } from '../abstract.repository';

export class BalanceRepository extends AbstractRepository {
  private _tableName: TableNameType = 'balance_history';
  constructor() {
    super();
  }

  async getBalanceByApiKey() {
    const result = await this._selectQuery<BalanceStateType>({
      tableName: this._tableName,
      column: [
        'usdt',
        'profit_all as "profitAll"',
        'exchange_name as "exchangeName"',
        'profit_usdt as profitUsdt',
        'profit_percent as profitPercent',
        'balance_object as "balanceObject"',
      ],
    });

    return (result && result[0]) ?? undefined;
  }
}
