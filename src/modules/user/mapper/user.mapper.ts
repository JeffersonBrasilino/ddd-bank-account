import { DomainError } from '@core/domain/errors';
import { UserAggregateRoot } from '../domain/user.aggregate-root';
import { UserBuilder } from '../domain/user.builder';
import { IMapper } from '@core/mapper/IMapper';

export class UserMapper implements IMapper<UserAggregateRoot> {
  toPersistence(domainData: UserAggregateRoot): object {
    return {
      uuid: domainData.getUuid(),
      username: domainData.getUsername(),
      password: domainData.getPassword().getValue(),
      verificationCode: domainData.getRecoveryCode(),
    };
  }

  toDto<toDtoResponseContracts>(
    domainData,
    convertTo?: string | boolean,
  ): toDtoResponseContracts {
    if (convertTo == 'GetPickUpPointsResponseDto')
      return UserMapper.dtoGet(domainData) as toDtoResponseContracts;

    return UserMapper.dtoList(domainData) as toDtoResponseContracts;
  }

  toDomain(rawData: Partial<any>): UserAggregateRoot {
    return UserBuilder.build(rawData) as UserAggregateRoot;
  }

  private static dtoGet(domainData) {
    return {
      establishment: domainData.establishment,
      address: domainData.address,
      number: domainData.number,
      state: domainData.state,
      zipCode: domainData.zipCode,
      region: domainData.region,
      uuid: domainData.uuid,
    };
  }

  private static dtoList(domainData) {
    return {
      establishment: domainData.establishment,
      address: domainData.address,
      number: domainData.number,
      state: domainData.state,
      zipCode: domainData.zipCode,
      region: domainData.region,
      location: domainData.location,
      distance: domainData.distance ?? undefined,
      uuid: domainData.uuid,
    };
  }
}
