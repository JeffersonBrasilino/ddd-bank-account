import {
  DomainMapperInterface,
  DtoMapperInterface,
  PersistenceMapperInterface,
} from '@core/mapper';
import { UserAggregateRoot } from '@module/user/domain/user.aggregate-root';
import { UserBuilder } from '@module/user/domain/user.builder';
import { UserExistsResponseDto } from '../application/queries/user-exists/user-exists.response.dto';
import { UserGroupsEntitytProps } from '../domain/user-groups.entity';
import { SaveUserDto } from '../infrastructure/database/typeorm/dtos/save-user.dto';
export class UserMapper
  implements
    DomainMapperInterface<UserAggregateRoot>,
    PersistenceMapperInterface<UserAggregateRoot>,
    DtoMapperInterface<UserAggregateRoot>
{
  private availableDtos = { userEistsResponse: UserExistsResponseDto };

  toPersistence(domainData: UserAggregateRoot): SaveUserDto {
    return new SaveUserDto(domainData);
  }

  toDto(
    domainData: UserAggregateRoot,
    convertTo?: keyof typeof this.availableDtos,
  ) {
    if (Object.keys(this.availableDtos).indexOf[convertTo] != -1)
      return new this.availableDtos[convertTo](domainData);
  }

  toDomain(rawData: Partial<any>) {
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
    if (rawData.password)
      build.withPassword({ value: rawData.password, alreadyValidated: true });
    if (rawData.devices) build.withDevices(rawData.devices);
    if (rawData.person) build.withPerson(rawData.person);

    return build.build() as UserAggregateRoot;
  }
}
