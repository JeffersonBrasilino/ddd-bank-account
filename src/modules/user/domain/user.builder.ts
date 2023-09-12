import { AbstractDomainBuilder } from '@core/domain/abstract-domain.builder';
import { PasswordValueObject } from './password.value-object';
import {
  PersonBuilder,
  WithPersonContactsProps,
} from './person/person.builder';
import { UserGroupsEntity, UserGroupsEntitytProps } from './user-groups.entity';
import {
  UserAggregateRoot,
  UserAggregateRootProps,
} from './user.aggregate-root';
import {
  UserDevicesEntity,
  UserDevicesEntitytProps,
} from './user-devices.entity';
import { PersonEntitytProps } from './person/person.entity';
import { AbstractError } from '@core/domain/errors';

export type withPersonProps = Omit<PersonEntitytProps, 'contacts'> & {
  contacts: WithPersonContactsProps[];
  cpf: string;
};

export class UserBuilder extends AbstractDomainBuilder<
  UserAggregateRoot,
  UserAggregateRootProps
> {
  withPassword(password: string): this {
    this.addFragment('password', {
      value: password,
      buildTo: PasswordValueObject,
    });
    return this;
  }

  withUsername(username: string): this {
    this.addFragment('username', {
      value: username,
    });
    return this;
  }

  withPerson(data: withPersonProps): this {
    const personBuilder = new PersonBuilder()
      .withId(data.id)
      .withUuId(data.uuid)
      .withBirthDate(data.birthDate)
      .withName(data.name)
      .withCpf(data.cpf)
      .withContacts(data.contacts)
      .build();

    if (personBuilder instanceof AbstractError) {
      this.addErrorFragment('person', personBuilder);
    } else {
      this.addBuildedFragment('person', personBuilder);
    }
    return this;
  }

  withRecoveryCode(recoveryCode: string): this {
    this.addFragment('recoveryCode', { value: recoveryCode });
    return this;
  }

  withUserGroups(rawUsersGroups: UserGroupsEntitytProps[]): this {
    const userGroupData = [];
    rawUsersGroups.map((group, key) => {
      const instance = UserGroupsEntity.create(group);
      if (instance instanceof AbstractError) {
        this.addErrorFragment(`UserGroupsEntity.${key}`, instance);
        return;
      }
      userGroupData.push(instance);
    });
    this.addBuildedFragment('userGroups', userGroupData);
    return this;
  }

  withDevices(data: UserDevicesEntitytProps[]): this {
    const userGroupData = [];
    data.map((device, key) => {
      const instance = UserDevicesEntity.create(device);
      if (instance instanceof AbstractError) {
        this.addErrorFragment(`UserDevicesEntity.${key}`, instance);
        return;
      }
      userGroupData.push(instance);
    });
    this.addBuildedFragment('devices', userGroupData);
    return this;
  }

  build(): UserAggregateRoot | AbstractError<any> {
    const dataBuidedOrError = this.prepareFragmentsToBuild();
    if (dataBuidedOrError instanceof AbstractError) {
      return dataBuidedOrError;
    }

    return UserAggregateRoot.create(dataBuidedOrError);
  }
}
