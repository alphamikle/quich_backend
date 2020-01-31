import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProxyEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  address!: string;

  @Column()
  protocol!: string;

  @Column({ type: 'integer' })
  port!: number;

  @Column({ default: 0, type: 'integer' })
  completeUses!: number;

  @Column({ default: 0, type: 'integer' })
  notCompleteUses!: number;

  @Column({ default: () => 'now()' })
  createdAt: Date;

  @Column({ default: () => 'now()' })
  lastUsedDate: Date;
}
