import { AbstractRepository } from 'repository/abstract.repository';
import { ConfigType, TableNameType } from 'repository/types/types';

export class ConfigRepository extends AbstractRepository {
  private tableName: TableNameType = 'trade_config';
  constructor() {
    super();
  }

  async getConfig(): Promise<ConfigType> {
    const result: ConfigType = await this._selectQuery<ConfigType>({
      tableName: this.tableName,
      column: [
        'position_size as "positionSize"',
        'count_grid_size as "countGridSize"',
        'grid_size as "gridSize"',
        'percent_buy_back as "percentBuyBack"',
        'take_profit as "takeProfit"',
        'stop_loss as "stopLoss"',
        'is_emergency_stop as "isEmergencyStop"',
      ],
    })[0];

    return result;
  }

  async getEmergencyStop(): Promise<{ isEmergencyStop: boolean }> {
    const result = await this._selectQuery<{ isEmergencyStop: boolean }>({
      tableName: this.tableName,
      column: ['is_emergency_stop'],
    })[0];

    return result;
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
