import { PersonContactEntity } from '@module/user/domain/person/person-contact.entity';
import { PersonEntity } from '@module/user/domain/person/person.entity';
import { UserDevicesEntity } from '@module/user/domain/user-devices.entity';
import { UserGroupsEntity } from '@module/user/domain/user-groups.entity';
import { UserAggregateRoot } from '@module/user/domain/user.aggregate-root';

export class SaveUserDto {
  readonly uuid?: string;
  readonly name?: string;
  readonly username?: string;
  readonly password?: string;
  readonly verificationCode?: string;
  readonly id?: string | number;
  readonly usersGroup?: Array<any>;
  readonly person?: object;
  readonly devices?: Array<any>;
  constructor(aggregate: UserAggregateRoot) {
    this.id = aggregate.getId();
    this.uuid = aggregate.getUuid();
    this.username = aggregate.getUsername();
    this.password = aggregate.getPassword().getValue();
    this.verificationCode = aggregate.getRecoveryCode();

    if (aggregate.getUserGroups() != undefined)
      this.usersGroup = this.parseUsersGroup(
        aggregate.getUserGroups(),
        aggregate.getId(),
      );
    if (aggregate.getPerson() != undefined)
      this.person = this.parsePerson(aggregate.getPerson());
    if (aggregate.getDevices() != undefined)
      this.devices = this.parseDevices(aggregate.getDevices());
  }

  private parseUsersGroup(usersGroup: UserGroupsEntity[], aggregateId?) {
    return usersGroup.map(ug => {
      return {
        uuid: ug.getUuid(),
        id: ug.getUserGroupUserId(),
        user: aggregateId ? { id: aggregateId } : undefined,
        userGroup: { id: ug.getId() },
        main: ug.isMain() ? 1 : 0,
      };
    });
  }

  private parseDevices(devices: UserDevicesEntity[]) {
    return devices.map(device => {
      return {
        id: device.getId(),
        uuid: device.getUuid(),
        deviceId: device.getDeviceId(),
        deviceName: device.getDeviceName(),
        authToken: device.getAuthToken(),
        refreshToken: device.getRefreshToken(),
        status: device.getStatus() ?? '1',
      };
    });
  }

  private parsePerson(person: PersonEntity) {
    const res = {
      id: person.getId(),
      uuid: person.getUuid(),
      name: person.getName(),
      birthDate: person.getBirthDate(),
      cpf: person.getCpf().getValue(),
    };
    if (person.getContacts() != undefined) {
      Object.assign(res, {
        contacts: this.parsePersonContacts(person.getContacts()),
      });
    }

    return res;
  }

  private parsePersonContacts(contacts: PersonContactEntity[]) {
    return contacts.map(contact => {
      return {
        id: contact.getId(),
        uuid: contact.getUuid(),
        description: contact.getDescription(),
        main: contact.isMain() ? 1 : 0,
        personContactType: {
          id: contact.getContactType()?.getId(),
        },
      };
    });
  }
}
