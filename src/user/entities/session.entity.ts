import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('session_entity')
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  token!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @Column('string')
  userId!: string;

  @ManyToOne(() => User, user => user.sessions, { onDelete: 'CASCADE' })
  user?: User;
}
