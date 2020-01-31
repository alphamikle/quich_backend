import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { FtsAccountEntity } from './fts-account.entity';

@Entity()
export class FtsAccountQueueEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  ftsAccountId!: string;

  @ManyToOne(() => FtsAccountEntity, { onDelete: 'CASCADE' })
  ftsAccount?: FtsAccountEntity;

  @CreateDateColumn()
  useDateTime!: Date;
}
