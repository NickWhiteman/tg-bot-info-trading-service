import { CreateOrderParamsType, OrderType, TableNameType } from '../types/types';
import { AbstractRepository } from '../abstract.repository';

export class OrderRepository extends AbstractRepository {
  private _tableName: TableNameType = 'trade_operation';

  constructor() {
    super();
  }

  async getAllActiveOrders(): Promise<OrderType[] | undefined> {
    const result = await this._selectQuery<OrderType>({
      tableName: this._tableName,
      column: ['id', '"order"', 'price', 'amount', 'side', 'symbol', 'order_id as "orderId"'],
      where: [
        { column: 'is_delete', value: 0 },
        { column: 'is_active', value: 1 },
      ],
      operationCondition: 'and',
    });

    if (!result) {
      throw new Error('Active orders not found!');
    }

    return result;
  }

  async getAllOrdersByIndexOperation(indexOperation: string): Promise<OrderType[] | undefined> {
    try {
      const result = await this._selectQuery<OrderType>({
        tableName: this._tableName,
        column: ['id', '"order"', 'price', 'amount', '"side"', 'symbol', 'order_id as "orderId"'],
        where: [
          { column: 'is_delete', value: 0 },
          { column: 'index_operation', value: indexOperation },
        ],
        operationCondition: 'and',
      });

      if (!result) {
        throw new Error('Active orders not found!');
      }

      return result;
    } catch (error) {
      console.error(error);
    }
  }

  async findOrderById(orderId: string): Promise<OrderType | undefined> {
    try {
      const result = await this._selectQuery<OrderType>({
        tableName: this._tableName,
        column: [
          'id',
          'order_id as "orderId"',
          '"order"',
          'create_at as "createAt"',
          'amount',
          'price',
          'side',
          'symbol',
          'is_active as "isActive"',
        ],
        where: [{ column: 'order_id', value: orderId }],
      });

      if (!result) {
        throw new Error('Not found order!');
      }

      return result[0];
    } catch (error) {
      console.error(error);
    }
  }

  async createOrder(operation: CreateOrderParamsType): Promise<{ message: string } | undefined> {
    try {
      await this._insertQuery({
        tableName: this._tableName,
        value: this._mappingValuesList(operation),
      });

      return {
        message: 'Order success was be created!',
      };
    } catch (error) {
      console.error(error);
    }
  }

  async deleteOrderById(orderId: string): Promise<{ message: string } | undefined> {
    try {
      await this._updateQuery({
        tableName: this._tableName,
        value: [{ column: 'is_delete', value: 1 }],
        where: [{ column: 'order_id', value: orderId }],
      });

      return {
        message: 'Order was be deleted!',
      };
    } catch (error) {
      console.error(error);
    }
  }

  async revertOrderActiveStatus(indexOperation: string): Promise<void> {
    try {
      await this._updateQuery({
        tableName: this._tableName,
        value: [{ column: 'is_active', value: 0 }],
        where: [{ column: 'index_operation', value: indexOperation }],
      });
    } catch (error) {
      console.error(error);
    }
  }
}
