import 'reflect-metadata';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiModelProperty }                                  from '@nestjs/swagger';
import { UserEntity }                                        from '../../user/entities/user.entity';

export enum MessageType {
  info = 'info',
  warning = 'warning',
  error = 'error'
}

const types = Object.keys(MessageType);

@Entity()
export class MessageEntity {
  @ApiModelProperty()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiModelProperty()
  @Column()
  title!: string;

  @ApiModelProperty()
  @Column()
  content!: string;

  @ApiModelProperty()
  @Column({ default: false })
  isRead!: boolean;

  @OneToMany(() => UserEntity, user => user.messages)
  user?: UserEntity;

  @Column()
  userId!: string;

  @ApiModelProperty({ enum: types })
  @Column({
    type: 'enum',
    enum: MessageType,
    default: MessageType.info,
  })
  type!: MessageType;
}