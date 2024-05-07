import { AbstractRepository } from '../../repository/abstract.repository';
import { SessionType, TableNameType } from '../types/types';
// SessionType;

export class SessionRepository extends AbstractRepository {
  private tableName: TableNameType = 'trade_session';

  constructor() {
    super();
  }

  async getAllSessionProfit(): Promise<number | undefined> {
    const profit = await this._selectQuery<{ profitSession: number }>({
      tableName: this.tableName,
      column: ['profit_session'],
      where: [{ column: 'is_active', value: 0 }],
    });

    if (!profit) {
      return;
    }

    return profit.reduce((acc, current) => acc + current.profitSession, 0);
  }

  async checkingActiveSession(): Promise<SessionType | undefined> {
    const indexSession: SessionType[] | undefined = await this._selectQuery<SessionType>({
      tableName: this.tableName,
      column: ['index_session as "indexSession"', 'is_active as "isActive"'],
      where: [{ column: 'is_active', value: 1 }],
    });

    return indexSession && indexSession[0];
  }
}
