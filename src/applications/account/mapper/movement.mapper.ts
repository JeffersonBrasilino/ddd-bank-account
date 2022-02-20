import { Movement } from '../domain/entities/movement';

/**
 * data mapper pattern.
 * classe de mapeamento entre domain, dto, persistencia
 * esta classe serve como intermediador entre o dominio e os servicos ao qual dependem dele
 * serve tambem para isolar ambas as camadas(infra e domain) a nivel de retorno e requisicao entre as mesmas
 */
export class MovementMapper {
  /**
   * converte o dado para o dominio, pode ser chamado na camada de infrastructure para transformar
   * o retorno do banco de dados no dominio
   */
  static toDomain(rawData: Partial<any>): Movement {
    return Movement.create({
      id: rawData.id,
      value: parseFloat(rawData.value),
      createdAt: rawData.createdAt,
    });
  }

  /**
   * converte o dominio para o padrao do banco de dados.
   * @param {Movement} data Users dados de dominio usuario.
   * @returns objeto no padrao de persisitencia do dominio
   */
  static toPersistence(data: Movement): any {
    return {
      id: data.id,
      value: data.value,
      createdAt: data.createdAt,
    };
  }

  /**
   * converte o dominio para o padrao de retorno, pode ser http, ou outro.
   * @param {Movement} data Users dados do dominio usuario
   * @returns objeto no padrao de retorno
   */
  static toDto(data: Movement): any {
    return {
      id: data.id,
      value: data.value,
      createdAt: data.createdAt,
    };
  }
}
