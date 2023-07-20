import {
  BaseRepositoryInterface,
  queryProps,
} from '@core/domain/contracts/base-repository.interface';
import { InfrastructureError } from '@core/infrastructure/errors/infrastructure.error';
import { FindOptionsWhere } from 'typeorm';
import { Repository } from 'typeorm/repository/Repository';
export interface FilterProps {
  name?: string;
  value?: any;
}
export interface FilterResponse {
  condition: any;
  value?: any;
  [key: string]: any;
}

export class TypeormBaseRepository<T> implements BaseRepositoryInterface<T> {
  private baseRepository: Repository<T>;
  constructor(protected entity) {
    if (!entity) throw Error('sem entidade no repositorio.');

    this.baseRepository = entity;
  }

  protected convertFilterNameToSnakeCase(filterName: string) {
    return filterName.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  }

  public getPaginationParams(page: number, perPage?: number) {
    perPage = perPage ?? 10;
    const pageNumber = page - 1;
    const skip = perPage * pageNumber;
    return { take: perPage, skip: skip };
  }
  list<TFilters extends queryProps>(
    filter?: TFilters,
  ): Promise<InfrastructureError | any> {
    throw new Error('Method not implemented.');
  }
  get(id: number | string): Promise<InfrastructureError | any> {
    return this.baseRepository.findOne({
      where: { id } as FindOptionsWhere<any>,
    });
  }
  find(filter: Partial<any>): Promise<InfrastructureError | T[]> {
    return this.baseRepository.find({
      where: filter as FindOptionsWhere<any>,
    });
  }
  upsert(data: T): Promise<InfrastructureError | any> {
    return this.baseRepository.save(data);
  }
  remove(data: Partial<any>, soft = true): Promise<any> {
    if (soft === true) {
      return this.baseRepository.softDelete(data);
    } else {
      return this.baseRepository.delete(data);
    }
  }

  async restoreDeleted(data: Partial<any>): Promise<T | any> {
    return await this.baseRepository.restore(data);
  }

  async exists(condition: Partial<any>): Promise<boolean> {
    const res = await this.baseRepository.count({ where: condition });
    return res > 0;
  }

  /**
   * verifica e adapta o valor para o filtro LIKE do typeorm.
   * para a função saber se a string é do tipoo like, a mesma deve vir entre % ex: %xxx%
   * @param string value
   * @returns Raw
   */
  // private likeFilter(filter: FilterProps): FilterResponse | void {
  //   const filterLikeString = filter.value.match(new RegExp(/^%(.+)%(25)?$/));
  //   if (filterLikeString != null) {
  //     //substitui o codigo unicode pelo caractere.
  //     const value = filter.value.replace(new RegExp(/(%25)/g), '%');

  //     const filterName = this.convertFilterNameToSnakeCase(filter.name);
  //     return {
  //       condition: `UPPER(${filterName}) LIKE UPPER(:${filterName})`,
  //       value: { [filterName]: value },
  //     };
  //   }
  // }

  // /**
  //  * verifica e adapta o valor para o filtro OK do typeorm.
  //  * para a função saber se a string é do tipo OR, a mesma deve vir separado por pipe '|' ex:aaa|bbbb
  //  * @param value
  //  * @returns FindOperator<any> | void
  //  */
  // private orFilter(orFilterConditions: Partial<any>): FilterResponse | void {
  //   let condition = '';
  //   let valueCondition: Partial<any> = {};
  //   const categoriesOrFilters = Object.keys(orFilterConditions) ?? [];
  //   let categoriesOrFiltersLength = categoriesOrFilters.length;

  //   //percorre os filtros vindos do serviço
  //   categoriesOrFilters.map((orTypeFilter) => {
  //     //verifica se o tipo de filtro é liberado para ser processado, casoo haja um novo filtro, bastat adicionar o tipo do filtro no array e a regra que o filtro aplicará.
  //     if (['like', 'equal'].indexOf(orTypeFilter) != -1) {
  //       //pega o tamanho do filtro, serve para calcular e adicionar o OR entre um filtro e outro.
  //       let lengthFilter = Object.keys(orFilterConditions[orTypeFilter]).length;
  //       //percorre os filtros, lembrando que os filtros devem ser passados como mapa ex:{chave:valor}.
  //       for (let filterLikeConditionName in orFilterConditions[orTypeFilter]) {
  //         //verifica se os filtros estão dentro da chave like, se estiver indica que a busca é por LIKE.
  //         if (orTypeFilter == 'like') {
  //           //chama a funçaõ que monta o filtro like.
  //           const conditionLike = this.likeFilter({
  //             name: filterLikeConditionName,
  //             value: '%' + orFilterConditions.like[filterLikeConditionName] + '%',
  //           });
  //           //caso a função retorne o filtro, adiciona o filtro na string de filtros processados, assim como o seu valor.
  //           if (conditionLike) {
  //             condition += conditionLike.condition;
  //             valueCondition = { ...valueCondition, ...conditionLike.value };
  //           }
  //         }
  //         //verifica se os filtros estão dentro do mapa equal, caso sim, o filtro é do tipo igualdade.
  //         if (orTypeFilter == 'equal') {
  //           //converte o nome do filtro para snake_case, pois os nomes de coluna no banco seguem esse parão.
  //           condition +=
  //             ' ' + this.convertFilterNameToSnakeCase(filterLikeConditionName) + ' = :' + filterLikeConditionName;

  //           valueCondition = {
  //             ...valueCondition,
  //             ...{
  //               [filterLikeConditionName]: orFilterConditions.like[filterLikeConditionName],
  //             },
  //           };
  //         }

  //         //verifica se existe mais de um filtro(pelo tamanho do mapa), se sim, adiciona a condição OR entre os filtros.
  //         if (lengthFilter > 1) {
  //           condition += ' OR ';
  //           lengthFilter--;
  //         }
  //       }
  //       //se existir mais de um tipo de filtro ou, adiciona a condição OR entre os tipos.
  //       if (categoriesOrFiltersLength > 1) {
  //         condition += ' OR ';
  //         categoriesOrFiltersLength--;
  //       }
  //     }
  //   });
  //   return {
  //     condition: condition,
  //     value: valueCondition,
  //   };
  // }

  // private inFilter(inFilters: Partial<any>): FilterResponse | void {
  //   let condition = '';
  //   let conditionValue: Partial<any> = {};
  //   let conditionength = Object.keys(inFilters).length ?? 0;
  //   for (let filterKey in inFilters) {
  //     condition += ` ${this.convertFilterNameToSnakeCase(filterKey)} IN (:...${filterKey})`;
  //     conditionValue = {
  //       ...conditionValue,
  //       ...{ [filterKey]: inFilters[filterKey] ?? [] },
  //     };

  //     if (conditionength > 1) {
  //       condition += ' AND ';
  //     }
  //   }

  //   return { condition: condition, value: conditionValue };
  // }

  // protected proccessQueryFilters(filters: Partial<any>, qb: SelectQueryBuilder<any>) {
  //   for (let filterKey in filters) {
  //     if (filterKey == 'orfilter') {
  //       const orFilter = this.orFilter(filters[filterKey]);
  //       if (orFilter) {
  //         qb.andWhere(orFilter.condition, orFilter.value);
  //       }
  //     } else if (filterKey == 'infilter') {
  //       const inFilter = this.inFilter(filters[filterKey]);
  //       if (inFilter) qb.andWhere(inFilter.condition, inFilter.value);
  //     } else {
  //       const filter = { name: filterKey, value: filters[filterKey] };
  //       //caso a string de busca vier ente porcento ex: %teste%, aplicará o filtro like.
  //       const likeFilter = this.likeFilter(filter);
  //       if (likeFilter) {
  //         qb.andWhere(likeFilter.condition, likeFilter.value);
  //       } else {
  //         const filterName = this.convertFilterNameToSnakeCase(filter.name);
  //         qb.andWhere(`${filterName} = :${filterName}`, {
  //           [filterName]: filter.value,
  //         });
  //       }
  //     }
  //   }
  // }

  // public getPaginationParams(page: number, perPage?: number) {
  //   perPage = perPage ?? 10;
  //   const pageNumber = page - 1;
  //   const skip = perPage * pageNumber;
  //   return { take: perPage, skip: skip };
  // }

  // async list(page: number, filter?: object, _perPage?: number, order?: object): Promise<any> {
  //   const { take: take, skip: skip } = this.getPaginationParams(page, _perPage);
  //   /*  const countResult = await this.baseRepository().find({
  //     where: (qb) => this.proccessQueryFilters(filter, qb),
  //   }); */
  //   const countResult = await this.baseRepository()
  //     .count
  //     //where:{}
  //     ();
  //   const rows = await this.baseRepository().find({
  //     take: take,
  //     skip: skip,
  //     //where: (qb) => this.proccessQueryFilters(filter, qb),
  //     order: order ?? {},
  //   });
  //   return { rows: rows, total: countResult, perPage: take };
  // }

  // get(id: number | string): Promise<T | any> {
  //   return this.baseRepository().findOne({
  //     where: { id: id } as FindOptionsWhere<any>,
  //   });
  // }

  // async save(data: Partial<any>, id?: number): Promise<T | any> {
  //   //id de edicao
  //   if (id) {
  //     Object.assign(data, { id: id });
  //   }
  //   //@ts-ignore
  //   return await this.baseRepository().save(data);
  // }

  // async delete(data: number | string | Partial<any>, soft = true): Promise<any> {
  //   //atualiza status para disparar o subs de updated e salvar o log no banco.
  //   if (typeof data !== 'object') {
  //     //@ts-ignore
  //     await this.baseRepository().save({
  //       id: data,
  //       status: '0',
  //     } as Partial<any>);
  //   }

  //   if (soft === true) {
  //     //@ts-ignore
  //     return await this.baseRepository().softDelete(data);
  //   } else {
  //     //@ts-ignore
  //     return await this.baseRepository().delete(data);
  //   }
  // }

  // async restoreDeleted(data: number | object): Promise<T | any> {
  //   return await this.baseRepository().restore(data);
  // }

  // async exists(condition: Partial<any>): Promise<boolean> {
  //   const res = await this.baseRepository().count({ where: condition });
  //   return res > 0;
  // }
}
