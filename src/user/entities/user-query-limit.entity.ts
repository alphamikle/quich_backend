import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '~/user/entities/user.entity';

@Entity('user_query_limit_entity')
export class UserQueryLimit {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @ManyToOne(() => User, user => user.queryLimits)
  user?: User;

  @Column({
    type: 'integer',
    default: 0,
  })
  queries!: number;

  @Column({
    type: 'integer',
    default: 2,
  })
  queryLimit!: number;

  @Column({
    type: 'date',
    default: () => 'now()',
  })
  usingDay!: Date;

  @Column({
    type: 'jsonb',
  })
  usingHistory!: Array<{ dateTime: Date; accountId: string | null; billHash: string }>;
}
