import {
  DomainMapperInterface,
  DtoMapperInterface,
  PersistenceMapperInterface,
} from '@core/mapper';
import { UserAggregateRoot } from '@module/user/domain/user.aggregate-root';
import { UserBuilder } from '@module/user/domain/user.builder';
import { UserGroupsEntitytProps } from '../domain/user-groups.entity';
import { SaveUserDto } from '../infrastructure/database/typeorm/dtos/save-user.dto';
export class UserMapper
  implements
    DomainMapperInterface<UserAggregateRoot>,
    PersistenceMapperInterface<UserAggregateRoot>,
    DtoMapperInterface<UserAggregateRoot>
{
  toPersistence(domainData: UserAggregateRoot): SaveUserDto {
    return new SaveUserDto(domainData);
  }

  toDto<TDto extends new (...args: any[]) => object>(
    domainData: UserAggregateRoot,
    convertTo?: TDto,
  ): InstanceType<TDto> {
    return new convertTo(domainData) as InstanceType<TDto>;
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
