import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity }                                        from './user.entity';

@Entity()
export class UserQueryLimitEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @ManyToOne(() => UserEntity, user => user.queryLimits)
  user?: UserEntity;

  @Column({
    type: 'integer',
    default: 0,
  })
  queries!: number;

  @Column({
    type: 'date',
    default: () => 'now()',
  })
  usingDay!: Date;

  @Column({
    type: 'jsonb',
  })
  usingHistory!: Array<{ dateTime: Date; accountId: string }>;
}
