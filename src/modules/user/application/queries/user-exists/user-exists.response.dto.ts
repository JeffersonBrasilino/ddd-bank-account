import { UserAggregateRoot } from '@module/user/domain/user.aggregate-root';

export class UserExistsResponseDto {
  readonly name: string;
  readonly cpf: string;
  readonly birthDate: Date;
  readonly phone: string;
  readonly email: string;
  constructor(aggregate: UserAggregateRoot) {
    const personData = aggregate.getPerson();
    this.name = personData.getName();
    this.cpf = personData.getCpf().getValue();
    this.birthDate = personData.getBirthDate();
    this.phone = personData.getContacts()[1].getDescription();
    this.email = personData.getContacts()[0].getDescription();
  }
}
