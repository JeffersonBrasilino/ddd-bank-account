import { AggregateRoot } from './aggregate-root';
import { Entity } from './entity';
import { AbstractError, ErrorFactory } from './errors';
import { ValueObject } from './value-object';

type FragmentProps = { buildTo?: object; value: any };
export abstract class AbstractDomainBuilder<TDomain, TDomainProps> {
  private buildedFragments: TDomainProps = {} as TDomainProps;
  private fragments: Map<string, FragmentProps> = new Map();
  private errors: Map<string, any> = new Map();

  private isDomainObject(buildTo: any): boolean {
    if (!buildTo) return false;

    const prototype = Object.getPrototypeOf(buildTo);
    return [AggregateRoot, Entity, ValueObject].some(
      domainType => prototype === domainType,
    );
  }

  prepareFragmentsToBuild(): TDomainProps | AbstractError<any> {
    for (const [key, val] of this.fragments) {
      if (this.isDomainObject(val.buildTo)) {
        const createFragment = val.buildTo['create'](val.value);
        if (createFragment instanceof AbstractError) {
          this.errors.set(val.buildTo['name'], createFragment.getError());
        } else {
          this.buildedFragments[key] = createFragment;
        }
      } else {
        if (val.value instanceof AbstractError) {
          this.errors.set(key, val.value.getError());
        } else {
          this.buildedFragments[key] = val.value;
        }
      }
    }

    if (this.errors.size > 0) {
      return ErrorFactory.create('Processing', Object.fromEntries(this.errors));
    }
    return this.buildedFragments;
  }
  /*   TODO: Implementar a possibilidade de adicionar um builder para que ele crie o objeto e adicione no buildedFragments
   exemplo: addBuilder(personBuilder, 'person', { name: 'John Doe' }) */
  addBuildedFragment(prop: string, value: any): void {
    this.buildedFragments[prop] = value;
  }

  addErrorFragment(prop: string, errors: AbstractError<any>) {
    this.errors.set(prop, errors.getError());
  }

  addFragment(name: string, value: FragmentProps): void {
    this.fragments.set(name, value);
  }

  withUuId(uuid: string): this {
    this.addFragment('uuid', { value: uuid });
    return this;
  }

  withCreatedAt(value: Date | undefined): this {
    this.addFragment('createdAt', { value });
    return this;
  }

  withUpdatedAt(value: Date | undefined): this {
    this.addFragment('updatedAt', { value });
    return this;
  }

  withDeletedAt(value: Date | undefined): this {
    this.addFragment('deletedAt', { value });
    return this;
  }

  withActive(value: boolean): this {
    this.addFragment('active', { value });
    return this;
  }

  abstract build(): TDomain | AbstractError<any>;

  toEnumValue<T extends Record<string, string>>(
    enumObj: T,
    value: string,
  ): T[keyof T] | undefined {
    if (Object.values(enumObj).includes(value as T[keyof T])) {
      return value as T[keyof T];
    }
    return undefined;
  }
}
