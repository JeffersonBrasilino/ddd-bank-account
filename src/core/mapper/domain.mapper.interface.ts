import { AbstractError } from '@core/domain/errors';

export interface DomainMapperInterface<T> {
  toDomain(rawData: Partial<any>): T | AbstractError<any>;
}
