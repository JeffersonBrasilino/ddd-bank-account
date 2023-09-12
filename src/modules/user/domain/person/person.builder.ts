import { AbstractDomainBuilder } from '@core/domain';
import { PersonEntity, PersonEntitytProps } from './person.entity';
import {
  PersonContactEntity,
  PersonContactEntitytProps,
} from './person-contact.entity';
import {
  PersonContactTypeEntity,
  PersonContactTypeEntitytProps,
} from './person-contact-type';
import { CpflValueObject } from './person-cpf.value-object';
import { AbstractError } from '@core/domain/errors';

export type WithPersonContactsProps = Omit<
  PersonContactEntitytProps,
  'contactType'
> & {
  contactType?: PersonContactTypeEntitytProps;
};
export class PersonBuilder extends AbstractDomainBuilder<
  PersonEntity,
  PersonEntitytProps
> {
  withContacts(data: WithPersonContactsProps[]): this {
    const buildedContacts = [];
    for (let contact of data) {
      if (contact['personContactType'] !== undefined)
        contact.contactType = contact['personContactType'];

      const contactTypeInstanceOrError = contact.contactType
        ? PersonContactTypeEntity.create(contact.contactType)
        : undefined;

      if (contactTypeInstanceOrError instanceof AbstractError)
        this.addErrorFragment(
          'PersonContactTypeEntity',
          contactTypeInstanceOrError,
        );

      const personContact = PersonContactEntity.create({
        ...contact,
        contactType: contactTypeInstanceOrError as PersonContactTypeEntity,
      });
      //TODO: ADJUST TO GROUP ERRORS.
      if (personContact instanceof AbstractError) {
        this.addErrorFragment('personContact', personContact);
      } else {
        buildedContacts.push(personContact);
      }
    }
    if (buildedContacts.length > 0) {
      this.addBuildedFragment('contacts', buildedContacts);
    }

    return this;
  }

  withCpf(data: string): this {
    this.addFragment('cpf', { value: data, buildTo: CpflValueObject });
    return this;
  }

  withName(data: string): this {
    this.addFragment('name', { value: data });
    return this;
  }

  withBirthDate(data: Date): this {
    this.addFragment('birthDate', { value: data });
    return this;
  }

  build(): PersonEntity | AbstractError<any> {
    const dataBuidedOrError = this.prepareFragmentsToBuild();
    if (dataBuidedOrError instanceof AbstractError) {
      return dataBuidedOrError;
    }

    return PersonEntity.create(dataBuidedOrError);
  }
}
