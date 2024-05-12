import { Pool } from 'pg';
import {
  BalanceStateType,
  ColumnName,
  ConfigType,
  CreateOrderParamsType,
  CreateStateBalanceParamType,
  InsertQueryParamType,
  SelectQueryParamType,
  UpdateQueryParamType,
  ValueGenerationParamType,
  ValueType,
  WhereGenerationParamType,
} from './types/types';
import { DatabaseService } from './DatabaseService/DatabaseService';

export abstract class AbstractRepository {
  private _db: Pool;
  constructor() {
    this._db = new DatabaseService()._db;
  }

  protected async _query<T>(query: string, ...args) {
    const result = (await this._db.query(query, args)).rows as T[];
    if (!result) {
      return;
    }
    return result;
  }

  protected async _insertQuery({ tableName, value }: InsertQueryParamType) {
    await this._query(
      `
        insert into ${tableName}(${this._insertColumnGeneration(value)})
            values(${this._insertValuesGeneration(value)})
        `,
    );
  }

  protected async _updateQuery({ tableName, value, where, operationCondition }: UpdateQueryParamType) {
    const whereString = this._whereChecker({ where, operationCondition });

    await this._query(
      `
        update ${tableName} 
          set ${this._updateValueGeneration(value)}
          ${whereString}
        `,
    );
  }

  protected async _selectQuery<T>({ tableName, column, where, operationCondition }: SelectQueryParamType) {
    const whereString = this._whereChecker({ where, operationCondition });

    return await this._query<T>(
      `
        select ${this._selectColumnGeneration(column)}
            from ${tableName}
            ${whereString}
        `,
    );
  }

  protected _mappingValuesList(
    values: BalanceStateType | CreateStateBalanceParamType | CreateOrderParamsType | Partial<ConfigType>,
  ) {
    console.log(Object.keys(values));
    return Object.keys(values).flatMap((name) => ({
      column: ColumnName[name],
      value: values[name],
    }));
  }

  private _updateValueGeneration(value: ValueGenerationParamType[]) {
    return value.flatMap((val) => `${val.column} = ${this._syntaxStringForSql(val.value)}`).join(', ');
  }

  private _whereGeneration(param: WhereGenerationParamType) {
    return (
      param.where &&
      param.where
        .flatMap((condition) => `${condition.column} = ${this._syntaxStringForSql(condition.value)}`)
        .join(` ${param.operationCondition} ` ?? '')
    );
  }

  private _whereChecker({ where, operationCondition }) {
    return where ? `where ${this._whereGeneration({ where, operationCondition })}` : ``;
  }

  private _selectColumnGeneration(columns: string[]) {
    return columns.join(', ');
  }

  private _insertColumnGeneration(value: ValueType[]) {
    return value.flatMap((item) => item.column).join(', ');
  }

  private _insertValuesGeneration(value: ValueType[]) {
    return value
      .flatMap(
        (item, index) =>
          `${
            typeof value[index].value === 'object'
              ? `'${JSON.stringify(value[index].value)}'`
              : typeof value[index].value === 'string'
              ? `'${value[index].value}'`
              : value[index].value
          }`,
      )
      .join(', ');
  }

  private _syntaxStringForSql(value: string | number) {
    return `${typeof value === 'string' ? `'${value}'` : value}`;
  }
}
