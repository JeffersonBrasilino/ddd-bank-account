import { DomainError } from '@core/domain/errors';

export interface IMapper<T> {
  toDomain(rawData: Partial<any>): T | DomainError;

  toDto<TConvertTo>(data, convertTo?: string | boolean): TConvertTo;

  toPersistence(domainData): any;
}
