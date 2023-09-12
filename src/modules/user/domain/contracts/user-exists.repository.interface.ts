import { AbstractError } from '@core/domain/errors';

export interface UserExistsRepositoryInterface {
  exists(cpf: string): Promise<boolean | AbstractError<any>>;
}
