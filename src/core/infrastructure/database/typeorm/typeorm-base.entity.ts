import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class TypeormBaseEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int8' })
  id: number;

  @Column({
    name: 'uuid',
    comment: 'identificador unico do registro',
  })
  uuid!: string;

  @Column({
    name: 'active',
    type: 'boolean',
    default: true,
    comment: 'situacao do registro. true - ativo, false - inativo',
  })
  active!: boolean;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    comment: 'data de criacao do registro',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    comment: 'data de ALTERACAO do registro',
  })
  updatedAt!: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    comment: 'data de EXCLUSAO do registro(soft-delete)',
  })
  deletedAt!: Date;
}
