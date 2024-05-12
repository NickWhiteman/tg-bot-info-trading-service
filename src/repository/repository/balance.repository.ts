import { BalanceStateType, CreateStateBalanceParamType, TableNameType } from 'repository/types/types';
import { AbstractRepository } from '../abstract.repository';

export class BalanceRepository extends AbstractRepository {
  private _tableName: TableNameType = 'balance_history';
  constructor() {
    super();
  }

  async createStateBalance(balanceState: CreateStateBalanceParamType) {
    try {
      await this._insertQuery({
        tableName: this._tableName,
        value: this._mappingValuesList(balanceState),
      });

      return {
        message: 'Balance success was be created!',
      };
    } catch (error) {
      console.error(error);
    }
  }

  async getBalanceByApiKey(apiKey: string) {
    const result = await this._selectQuery<BalanceStateType>({
      tableName: this._tableName,
      column: [
        'usdt',
        'eth',
        'btc',
        'profit_all as "profitAll"',
        'exchange_name as "exchangeName"',
        'update_date as "updateDate"',
        'profit_eth as profitEth',
        'profit_usdt as profitUsdt',
        'profit_percent as profitPercent',
      ],
      where: [{ column: 'api_key', value: apiKey }],
    });

    return (result && result[0]) ?? undefined;
  }

  async updateBalance(apiKey: string, balance: BalanceStateType) {
    console.log('ПРОВЕРКА =>', this._mappingValuesList(balance));
    await this._updateQuery({
      tableName: this._tableName,
      value: this._mappingValuesList(balance),
      where: [{ column: 'api_key', value: apiKey }],
    });
  }

  async updateProfitSession(apiKey: string, profitSession: number) {
    this._updateQuery({
      tableName: this._tableName,
      value: [{ column: 'profit_session', value: profitSession }],
      where: [{ column: 'api_key', value: apiKey }],
    });
  }
}
