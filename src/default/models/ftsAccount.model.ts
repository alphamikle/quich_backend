import 'reflect-metadata';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserModel }                                                           from './user.model';

@Entity({ name: 'fts_account' })
export class FtsAccountModel {

  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Column({ unique: true })
  phone: string;

  @Column({ nullable: true })
  password: string;

  @Column()
  isMain: boolean;

  @Column({ type: 'integer' })
  userId: number;

  @ManyToOne(() => UserModel, user => user.ftsAccounts, { onDelete: 'CASCADE' })
  user: UserModel;

  @CreateDateColumn()
  createdAt: Date;
}
