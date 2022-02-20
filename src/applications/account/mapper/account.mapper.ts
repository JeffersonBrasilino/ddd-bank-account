import { Account } from '../domain/entities/account';
import { CpfValueObject } from '../domain/value-objects/cpf.value-object';
import { MovementMapper } from './movement.mapper';

/**
 * data mapper pattern.
 * classe de mapeamento entre domain, dto, persistencia
 * esta classe serve como intermediador entre o dominio e os servicos ao qual dependem dele
 * serve tambem para isolar ambas as camadas(infra e domain) a nivel de retorno e requisicao entre as mesmas
 */
export class AccountMapper {
  /**
   * converte o dado para o dominio, pode ser chamado na camada de infrastructure para transformar
   * o retorno do banco de dados no dominio
   */
  static toDomain(rawData: Partial<any>): Account {
    return Account.create({
      id: rawData.id,
      cpf: CpfValueObject.create(rawData.cpf),
      name: rawData.name,
      createdAt: rawData.createdAt,
      movement: rawData.movement
        ? MovementMapper.toDomain(rawData.movement)
        : null,
    });
  }

  /**
   * converte o dominio para o padrao do banco de dados.
   * @param {Account} data Users dados de dominio usuario.
   * @returns objeto no padrao de persisitencia do dominio
   */
  static toPersistence(data: Account): any {
    return {
      id: data.id,
      cpf: data.cpf,
      name: data.name,
      createdAt: data.createdAt,
      movement: data.movement
        ? MovementMapper.toPersistence(data.movement)
        : null,
    };
  }

  /**
   * converte o dominio para o padrao de retorno, pode ser http, ou outro.
   * @param {Account} data Users dados do dominio usuario
   * @returns objeto no padrao de retorno
   */
  static toDto(data: Account): any {
    return {
      id: data.id,
    };
  }
}
