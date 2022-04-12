import { BaseEntity } from '@infrastructure/database/core/base.entity';
import { Column, Entity, OneToOne, OneToMany } from 'typeorm';
import { MovementEntity } from './movement.entity';

@Entity('account')
export class AccountEntity extends BaseEntity {
  @Column({ comment: 'cpf do proprietario da conta', length: 12 })
  cpf!: string;

  @Column({ comment: 'nome do proprietario da conta', length: 50 })
  name!: string;

  @OneToMany(() => MovementEntity, (me) => me.account, {
    cascade: ['insert', 'update'],
  })
  movement!: MovementEntity[];
}
