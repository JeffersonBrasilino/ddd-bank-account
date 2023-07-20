import { InfrastructureError } from '../../infrastructure/errors/infrastructure.error';
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
  ): Promise<InfrastructureError | any>;

  get(id: number | string): Promise<InfrastructureError | any>;

  find(filter: Partial<any>): Promise<InfrastructureError | T[]>;

  upsert(data: T): Promise<InfrastructureError | any>;

  remove(filter: Partial<any>, soft: boolean): Promise<any>;

  exists(condition: Partial<any>): Promise<boolean>;

  restoreDeleted(data: Partial<any>): Promise<T | any>;
}
