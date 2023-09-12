import { AggregateRoot } from './aggregate-root';
import { Entity } from './entity';
import { AbstractError } from './errors';
import { InternalError } from './errors/internal.error';
import { ValueObject } from './value-object';

type FragmentProps = { buildTo?: object; value: any };
export abstract class AbstractDomainBuilder<TDomain, TDomainProps> {
  private buildedFragments: TDomainProps = {} as TDomainProps;
  private fragments: Map<string, FragmentProps> = new Map();
  private errors: Map<string, any> = new Map();

  prepareFragmentsToBuild(): TDomainProps | AbstractError<any> {
    for (const [key, val] of this.fragments) {
      if (
        val.buildTo != undefined &&
        [AggregateRoot, Entity, ValueObject].indexOf(
          Object.getPrototypeOf(val.buildTo),
        ) != -1
      ) {
        const createFragment = val.buildTo['create'](val.value);
        if (createFragment instanceof AbstractError)
          this.errors.set(val.buildTo['name'], createFragment.getError());
        else this.buildedFragments[key] = createFragment;
      } else {
        this.buildedFragments[key] = val.value;
      }
    }

    if (this.errors.size > 0) {
      return new InternalError(Object.fromEntries(this.errors));
    }
    return this.buildedFragments;
  }

  addBuildedFragment(prop: string, value: any): void {
    this.buildedFragments[prop] = value;
  }

  addErrorFragment(prop: string, errors: AbstractError<any>) {
    this.errors.set(prop, errors.getError());
  }

  addFragment(name: string, value: FragmentProps): void {
    this.fragments.set(name, value);
  }

  withId(id: string | number): this {
    this.addFragment('id', { value: id });
    return this;
  }

  withUuId(uuid: string): this {
    this.addFragment('uuid', { value: uuid });
    return this;
  }

  abstract build(): TDomain | AbstractError<any>;
}
