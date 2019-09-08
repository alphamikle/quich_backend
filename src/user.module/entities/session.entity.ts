import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity()
export class SessionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  token: string;

  @Column({ default: false })
  isExpired: boolean;

  @Column()
  expiredAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @Column('integer')
  userId: number;
  @ManyToOne(() => UserEntity, user => user.sessions, { onDelete: 'CASCADE' })
  user: UserEntity;
}
