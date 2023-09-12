import {
  DomainMapperInterface,
  DtoMapperInterface,
  PersistenceMapperInterface,
} from '@core/mapper';
import { UserBuilder } from '@module/user/domain/user.builder';
import { UserAggregateRoot } from '../domain/user.aggregate-root';
import { UserGroupsEntitytProps } from '../domain/user-groups.entity';

export class UserMapper
  implements
    DomainMapperInterface<UserAggregateRoot>,
    PersistenceMapperInterface<UserAggregateRoot>,
    DtoMapperInterface<UserAggregateRoot>
{
  toPersistence(domainData: UserAggregateRoot): object {
    const rawData = {
      id: domainData.getId(),
      uuid: domainData.getUuid(),
      username: domainData.getUsername(),
      password: domainData.getPassword().getValue(),
      verificationCode: domainData.getRecoveryCode(),
      usersGroup: domainData.getUserGroups()
        ? domainData.getUserGroups().map(ug => {
            return {
              uuid: ug.getUuid(),
              id: ug.getUserGroupUserId(),
              user: domainData.getId() ? { id: domainData.getId() } : undefined,
              userGroup: { id: ug.getId() },
              main: ug.isMain() ? 1 : 0,
            };
          })
        : undefined,
      person: domainData.getPerson()
        ? {
            id: domainData.getPerson().getId(),
            uuid: domainData.getPerson().getUuid(),
            name: domainData.getPerson().getName(),
            birthDate: domainData.getPerson().getBirthDate(),
            cpf: domainData.getPerson().getCpf().getValue(),
            contacts: domainData.getPerson().getContacts()
              ? domainData
                  .getPerson()
                  .getContacts()
                  .map(contact => {
                    return {
                      id: contact.getId(),
                      uuid: contact.getUuid(),
                      description: contact.getDescription(),
                      main: contact.isMain() ? 1 : 0,
                      personContactType: {
                        id: contact.getContactType()?.getId(),
                      },
                    };
                  })
              : undefined,
          }
        : undefined,
      devices: domainData.getDevices()
        ? domainData.getDevices().map(device => {
            return {
              id: device.getId(),
              uuid: device.getUuid(),
              deviceId: device.getDeviceId(),
              deviceName: device.getDeviceName(),
              authToken: device.getAuthToken(),
              refreshToken: device.getRefreshToken(),
              status: device.getStatus() ?? '1',
            };
          })
        : undefined,
    };

    return rawData;
  }

  toDto(domainData: UserAggregateRoot, convertTo?: string): any {
    const dtosFunction = ['userExistsResponse'];
    if (dtosFunction.indexOf(convertTo) != -1)
      return this[convertTo](domainData);
  }

  toDomain(rawData: Partial<any>): UserAggregateRoot {
    const build = new UserBuilder()
      .withId(rawData.id)
      .withUuId(rawData.uuid)
      .withUsername(rawData.username);
    if (rawData.usersGroup) {
      const usersGroup = rawData.usersGroup.map(val => {
        return {
          uuid: val.uuid,
          id: val.userGroup.id,
          main: val.main,
          userGroupUserId: val.id,
        } as UserGroupsEntitytProps;
      });
      build.withUserGroups(usersGroup);
    }
    if (rawData.password) build.withPassword(rawData.password);
    if (rawData.devices) build.withDevices(rawData.devices);
    if (rawData.person) build.withPerson(rawData.person);

    return build.build() as UserAggregateRoot;
  }

  userExistsResponse(domainData: UserAggregateRoot): object {
    const personData = domainData.getPerson();
    return {
      name: personData.getName(),
      cpf: personData.getCpf(),
      birthDate: personData.getBirthDate(),
      phone: personData.getContacts()[1].getDescription(),
      email: personData.getContacts()[0].getDescription(),
    };
  }
}
