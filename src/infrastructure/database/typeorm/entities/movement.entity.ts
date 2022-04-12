import { BaseEntity } from '@infrastructure/database/core/base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { AccountEntity } from './account.entity';

@Entity('movement')
export class MovementEntity extends BaseEntity {
  @Column({
    comment: 'valor do saldo',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  value!: number;

  @ManyToOne(() => AccountEntity, (ae) => ae.movement)
  @JoinColumn({
    name: 'account_id',
  })
  account!: AccountEntity;
}
