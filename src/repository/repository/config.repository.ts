import { AbstractRepository } from '../abstract.repository';
import { ConfigType, TableNameType } from '../types/types';

export class ConfigRepository extends AbstractRepository {
  private tableName: TableNameType = 'trade_config';
  constructor() {
    super();
  }

  async getConfig(): Promise<ConfigType[]> {
    const result = await this._selectQuery<ConfigType>({
      tableName: this.tableName,
      column: [
        'position_size as "positionSize"',
        'count_grid_size as "countGridSize"',
        'grid_size as "gridSize"',
        'percent_buy_back as "percentBuyBackStep"',
        'take_profit as "takeProfit"',
        'stop_loss as "stopLoss"',
        'is_emergency_stop as "isEmergencyStop"',
        'percent_profit as "percentProfit"',
        'percent_from_balance as "percentFromBalance"',
        'candle_price_range as "candlePriceRange"',
        'api_key as "apiKey"',
        'private_key as "privateKey"',
        'password',
        'exchange',
        'symbol',
      ],
    });

    if (!result) {
      throw new Error('Config not found - you need create config in database!');
    }

    return result ?? ({} as ConfigType);
  }

  async getEmergencyStop(): Promise<{ isEmergencyStop: boolean }> {
    const result = await this._selectQuery<{ isEmergencyStop: boolean }>({
      tableName: this.tableName,
      column: ['is_emergency_stop as "isEmergencyStop"'],
    });

    if (!result) {
      throw new Error('Config is not found!');
    }

    return result[0];
  }

  async enableEmergencyStop(): Promise<void> {
    await this._updateQuery({
      tableName: this.tableName,
      value: [{ column: 'is_emergency_stop', value: 1 }],
    });
  }

  async updateConfig(config: Partial<ConfigType>) {
    await this._updateQuery({
      tableName: this.tableName,
      value: this._mappingValuesList(config),
    });
  }
}
