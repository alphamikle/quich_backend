import 'reflect-metadata';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '~/user/entities/user.entity';

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

  @ManyToOne(() => User, user => user.messages)
  user?: User;

  @Column({ nullable: true })
  userId?: string;

  @Column({ enum: Object.values(MessageType), default: MessageType.INFO })
  type!: MessageType;
}