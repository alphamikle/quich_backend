import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { FtsAccountEntity } from './ftsAccount.entity';
import { SessionEntity } from './session.entity';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => FtsAccountEntity, account => account.user)
  ftsAccounts?: FtsAccountEntity[];

  @OneToMany(() => SessionEntity, session => session.user)
  sessions?: SessionEntity[];
}
