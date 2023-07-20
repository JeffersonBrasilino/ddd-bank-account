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
    nullable: true,
    comment: 'identificador unico do registro',
  })
  uuid!: string;

  @Column({
    type: 'char',
    default: '1',
    comment: 'situacao do registro. 1 - ativo, 0 - inativo',
  })
  status!: string;

  @CreateDateColumn({
    name: 'created_at',
    comment: 'data de criacao do registro',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    comment: 'data de ALTERACAO do registro',
  })
  updatedAt!: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    comment: 'data de EXCLUSAO do registro(soft-delete)',
  })
  deletedAt!: Date;
}
