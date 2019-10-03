import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'session' })
export class SessionModel {

  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Column()
  token: string;

  @Column()
  expiredAt: Date;

  @Column()
  email: string;

  @Column()
  isExpired: boolean;

  @CreateDateColumn()
  createdAt: Date;

}
