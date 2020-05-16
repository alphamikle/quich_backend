import 'reflect-metadata';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '~/user/entities/user';

export enum MessageType {
  INFO,
  WARNING,
  ERROR,
}

@Entity()
export class MessageEntity {

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column()
  content!: string;

  @Column({ default: false })
  isRead!: boolean;

  @OneToMany(() => User, user => user.messages)
  user?: User;

  @Column()
  userId!: string;

  @Column({ enum: Object.values(MessageType), default: MessageType.INFO })
  type!: MessageType;
}