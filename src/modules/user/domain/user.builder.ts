import { DomainError } from '@core/domain/errors';
import { PasswordValueObject } from './password.value-object';
import { PersonContactEntity } from './person-contact.entity';
import { PersonEntity } from './person.entity';
import { UserGroupsEntity, UserGroupsEntitytProps } from './user-groups.entity';
import {
  UserAggregateRoot,
  UserAggregateRootProps,
} from './user.aggregate-root';

export class UserBuilder {
  private builderErrors = new Map<string, any>();
  private constructor() {}
  getBuilderErrors(): Map<string, any> {
    return this.builderErrors;
  }

  buildPassword(password: string): PasswordValueObject | void {
    const passwordVo = PasswordValueObject.create(password);

    if (passwordVo instanceof DomainError) {
      this.builderErrors.set('password', passwordVo.getError());
      return;
    }
    return passwordVo;
  }

  buildUserGroups(rawUsersGroups: Array<any>): Array<UserGroupsEntity> | void {
    //TODO: ADDED GROUP PERMISSIONS HERE
    const errors = [];
    const groups = rawUsersGroups.map((gp, i) => {
      const instance = UserGroupsEntity.create({
        ...gp.userGroup,
        main: gp.main,
      } as UserGroupsEntitytProps);
      if (instance instanceof DomainError) {
        errors.push({ arrayPosition: i, errors: instance.getError() });
        return;
      }
      return instance;
    });

    if (errors.length > 0) {
      this.builderErrors.set('usersGroup', errors);
      return;
    }
    return groups;
  }

  buildPersonContact(data: Partial<any>): PersonContactEntity | void {
    const contact = PersonContactEntity.create({
      uuid: data.uuid,
      description: data.description,
      main: data.main,
    });

    if (contact instanceof DomainError) {
      this.builderErrors.set('personContact', contact.getError());
      return;
    }
    return contact;
  }

  buildPerson(rawData: Partial<any>): PersonEntity | void {
    const errors = [];
    const contacts = rawData.contacts.map((contact, i) => {
      const instance = this.buildPersonContact(contact);
      if (instance instanceof DomainError) {
        errors.push({ arrayPosition: i, errors: instance.getError() });
        return;
      }
      return instance;
    });

    if (errors.length > 0) {
      this.builderErrors.set('PersonContacts', errors);
      return;
    }
    const entity = PersonEntity.create({
      uuid: rawData.uuid,
      contacts: contacts,
    });
    if (entity instanceof DomainError) {
      this.builderErrors.set('person', entity.getError());
      return;
    }
    return entity;
  }

  static build(data?: Partial<any>): UserAggregateRoot | DomainError {
    const buildInstance = new UserBuilder();
    const userProps: UserAggregateRootProps = {
      id: data.id,
      username: data.username,
    };

    if (data.password) {
      const passwordVo = buildInstance.buildPassword(data.password);
      if (passwordVo != undefined) {
        userProps.password = passwordVo as PasswordValueObject;
      }
    }

    if (data.usersGroup) {
      const usersGroup = buildInstance.buildUserGroups(data.usersGroup);
      if (usersGroup != undefined) {
        userProps.userGroups = usersGroup as UserGroupsEntity[];
      }
    }

    if (data.person) {
      const person = buildInstance.buildPerson(data.person);
      if (person != undefined) {
        userProps.person = person as PersonEntity;
      }
    }

    if (data.uuid) {
      userProps.uuid = data.uuid;
    }

    if (buildInstance.getBuilderErrors().size > 0) {
      return new DomainError(
        Object.fromEntries(buildInstance.getBuilderErrors()),
      );
    }

    return UserAggregateRoot.create(userProps);
  }
}
