import { Entity } from '@core/domain';
import {
  BaseRepositoryInterface,
  findRelations,
  listFilterProps,
  listResponseProps,
} from '@core/domain/contracts/base-repository.interface';
import { AbstractError, ErrorFactory } from '@core/domain/errors';
import { DomainMapperInterface } from '@core/mapper';
import { PersistenceMapperInterface } from '@core/mapper/persistence.mapper.interface';
import {
  EntityManager,
  EntityNotFoundError,
  EntityTarget,
  FindOptionsOrder,
  FindOptionsRelations,
  FindOptionsWhere,
  Raw,
  Repository,
} from 'typeorm';
import { getPaginationParams as paginationUtil } from './pagination.util';
import { TypeormBaseEntity } from './typeorm-base.entity';
import { TypeormConnection } from './typeorm.connection';
import { LoggerDecorator } from '@core/infrastructure/logger';

export interface FilterProps {
  name?: string;
  value?: any;
}

export interface FilterResponse {
  condition: any;
  value?: any;
  [key: string]: any;
}

export type repositoryMapperType<T> = PersistenceMapperInterface<T> &
  DomainMapperInterface<T>;

export class TypeormBaseRepository<
  TAggregateRoot extends Entity,
  TAggregateEntity extends TypeormBaseEntity,
> implements BaseRepositoryInterface<TAggregateRoot>
{
  protected entity: EntityTarget<TAggregateEntity>;
  protected mapper: repositoryMapperType<TAggregateRoot>;
  protected readonly injectedRepository?: Repository<TAggregateEntity>;

  constructor(
    entityOrRepository:
      | EntityTarget<TAggregateEntity>
      | Repository<TAggregateEntity>,
    mapper: repositoryMapperType<TAggregateRoot>,
  ) {
    if (!entityOrRepository) {
      throw Error('sem entidade no repositorio.');
    }

    if (this.isRepository(entityOrRepository)) {
      this.injectedRepository = entityOrRepository;
      this.entity = entityOrRepository.target as EntityTarget<TAggregateEntity>;
    } else {
      this.entity = entityOrRepository;
    }

    this.mapper = mapper;
  }

  private isRepository(
    candidate: unknown,
  ): candidate is Repository<TAggregateEntity> {
    if (candidate === null || typeof candidate !== 'object') {
      return false;
    }
    const r = candidate as Repository<TAggregateEntity>;
    return typeof r.find === 'function' && typeof r.save === 'function';
  }

  protected get baseRepository(): Repository<TAggregateEntity> {
    return (
      this.injectedRepository ??
      TypeormConnection.getConnection().getRepository(this.entity)
    );
  }

  protected getRepo(manager?: EntityManager): Repository<TAggregateEntity> {
    if (manager) return manager.getRepository(this.entity as any);
    return this.baseRepository;
  }

  protected getPaginationParams(page?: number, perPage?: number) {
    return paginationUtil(page, perPage);
  }

  @LoggerDecorator()
  async list(
    filter?: listFilterProps<TAggregateRoot>,
    relations?: findRelations,
  ): Promise<AbstractError<any> | listResponseProps<TAggregateRoot>> {
    try {
      const { page, perPage } = filter;
      const { take, skip } = this.getPaginationParams(page, perPage);

      const where = this.processQueyFilter(
        filter ?? ({} as listFilterProps<TAggregateRoot>),
      );

      const totalResult = await this.baseRepository.count({
        where: where as FindOptionsWhere<TAggregateEntity>,
      });
      if (totalResult == 0) {
        return { totalRows: 0, perPage: 0, totalPages: 0, data: [] };
      }

      const rows = await this.baseRepository.find({
        take,
        skip,
        where: where as FindOptionsWhere<TAggregateEntity>,
        relations: relations as FindOptionsRelations<TAggregateEntity>,
        order: {
          createdAt: 'desc',
        } as FindOptionsOrder<TAggregateEntity>,
      });

      const aggregateList = rows.map(data => {
        return this.mapper.toDomain(data) as TAggregateRoot;
      });
      const totalPages = Math.ceil(totalResult / take);
      return {
        totalRows: totalResult,
        perPage: take,
        totalPages,
        data: aggregateList,
      };
    } catch (e) {
      return ErrorFactory.create('Dependency', e.toString());
    }
  }

  @LoggerDecorator()
  async get(
    uuid: string,
    relations?: findRelations,
  ): Promise<AbstractError<any> | TAggregateRoot> {
    try {
      const data = await this.baseRepository.findOne({
        where: { uuid } as FindOptionsWhere<TAggregateEntity>,
        relations: relations as FindOptionsRelations<TAggregateEntity>,
      });

      if (!data) {
        return ErrorFactory.create('NotFound', 'Not found.');
      }

      return this.mapper.toDomain(data);
    } catch (e) {
      return ErrorFactory.create('Dependency', e.toString());
    }
  }

  @LoggerDecorator()
  async insert(data: TAggregateRoot): Promise<boolean | AbstractError<any>> {
    try {
      const dataToPersist = this.mapper.toPersistence(data);
      await this.baseRepository.save(dataToPersist);
      return true;
    } catch (e) {
      return ErrorFactory.create('Dependency', e.toString());
    }
  }

  @LoggerDecorator()
  async update(data: TAggregateRoot): Promise<boolean | AbstractError<any>> {
    try {
      const dataDb = await this.baseRepository.findOneOrFail({
        where: { uuid: data.uuid() } as FindOptionsWhere<any>,
      });

      const dataToPersist = this.mapper.toPersistence(data);
      this.baseRepository.merge(dataDb, dataToPersist);
      await this.baseRepository.save(dataDb);
      return true;
    } catch (e) {
      if (e instanceof EntityNotFoundError)
        return ErrorFactory.create('NotFound', 'Not found.');

      return ErrorFactory.create('Dependency', e.toString());
    }
  }

  @LoggerDecorator()
  async remove(
    uuid: string,
    soft = true,
  ): Promise<boolean | AbstractError<any>> {
    try {
      const entity = await this.baseRepository.findOne({
        where: { uuid } as FindOptionsWhere<any>,
      });

      if (!entity) {
        return ErrorFactory.create('NotFound', 'Entity not found.');
      }

      if ('active' in entity) {
        await this.baseRepository.update(
          { uuid } as FindOptionsWhere<any>,
          { active: false } as any,
        );
      }

      if (soft === true) {
        await this.baseRepository.softDelete({ uuid } as FindOptionsWhere<any>);
        return true;
      }

      await this.baseRepository.delete({ uuid } as FindOptionsWhere<any>);
      return true;
    } catch (e) {
      return ErrorFactory.create('Dependency', e.toString());
    }
  }

  @LoggerDecorator()
  async restoreDeleted(data: Partial<any>): Promise<TAggregateRoot | any> {
    return await this.baseRepository.restore(data);
  }

  @LoggerDecorator()
  async exists(condition: Partial<any>): Promise<boolean | AbstractError<any>> {
    try {
      const res = await this.baseRepository.count({ where: condition });
      if (res > 0) {
        return true;
      }
      return ErrorFactory.create('NotFound', 'Not found.');
    } catch (e) {
      return ErrorFactory.create('Dependency', e.toString());
    }
  }

  protected convertFilterNameToSnakeCase(filterName: string) {
    return filterName.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  }

  /**
   * verifica e adapta os filtros para o typeorm.
   * usa como base as chaves dos campos da raiz agregada.
   *
   * o tipo de filtro a ser aplicado deve ser informado antes do valor
   *
   * filtros disponiveis: like
   * @example
   * ```ts
   * const filter = {
   *  key: "like:test"
   * }
   * processQueyFilter(filter)
   * ```
   * @param string value
   * @returns listFilterProps<TAggregateRoot>
   */
  protected processQueyFilter(filters: listFilterProps<TAggregateRoot>) {
    const ignoredProps = ['page', 'perPage'];
    const availableFiltersFunctions = { like: this.likeFilter };
    let proccessedFilters = {};
    for (const key in filters) {
      if (ignoredProps.indexOf(key) != -1 || !filters[key]) {
        continue;
      }

      const typeAndValueFilter = filters[key].split(':');
      if (
        typeAndValueFilter.length == 1 ||
        !availableFiltersFunctions[typeAndValueFilter[0]]
      ) {
        proccessedFilters[key] = filters[key];
        continue;
      }

      const [type, value] = typeAndValueFilter;
      const result = availableFiltersFunctions[type](key, value);
      proccessedFilters = { ...proccessedFilters, ...result };
    }

    return proccessedFilters;
  }

  private likeFilter(key: string, value: any): any {
    const filter = {};
    filter[key] = Raw(alias => `unaccent(lower(${alias})) like unaccent(lower(:value))`, {
      value: `%${value}%`,
    });

    return filter;
  }
}
