import { AbstractError } from '../errors';

export type listFilterProps<T> = {
  page?: number;
  perPage: number;
} & Partial<T>;

export type listResponseProps<T> = {
  data: T[];
  perPage: number;
  totalRows: number;
  totalPages: number;
};

export type findRelations = {
  [key: string]: boolean;
};

export interface BaseRepositoryInterface<TAggregateRoot> {
  list(
    filter?: listFilterProps<TAggregateRoot>,
    relations?: findRelations,
  ): Promise<AbstractError<any> | listResponseProps<TAggregateRoot>>;

  get(
    uuid: string,
    relations?: findRelations,
  ): Promise<AbstractError<any> | TAggregateRoot>;

  insert(data: TAggregateRoot): Promise<boolean | AbstractError<any>>;

  update(data: TAggregateRoot): Promise<boolean | AbstractError<any>>;

  remove(uuid: string, soft: boolean): Promise<boolean | AbstractError<any>>;

  exists(
    condition: Partial<TAggregateRoot>,
  ): Promise<boolean | AbstractError<any>>;

  restoreDeleted(data: Partial<TAggregateRoot>): Promise<TAggregateRoot | any>;
}
