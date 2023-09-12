import { AbstractError } from '../errors';

export type queryProps = {
  page?: number;
  perPage?: number;
};
export type listProps<T> = {
  rows: T[];
  perPage: number;
  totalRows: number;
};

export interface BaseRepositoryInterface<T> {
  getPaginationParams(page: number, perPage?: number);

  list<TFilters extends queryProps>(
    filter?: TFilters,
  ): Promise<AbstractError<any> | any>;

  get(id: number | string): Promise<AbstractError<any> | any>;

  find(filter: Partial<any>): Promise<AbstractError<any> | T[]>;

  upsert(data: T): Promise<AbstractError<any> | any>;

  remove(filter: Partial<any>, soft: boolean): Promise<any>;

  exists(condition: Partial<any>): Promise<boolean>;

  restoreDeleted(data: Partial<any>): Promise<T | any>;
}
