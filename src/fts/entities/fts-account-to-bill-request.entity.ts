import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BillRequestEntity }                                 from '../../bill-request/entities/bill-request.entity';
import { FtsAccountEntity }                                  from '../../user/entities/fts-account.entity';

@Entity()
export class FtsAccountToBillRequestEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  billRequestId!: string;

  @ManyToOne(() => BillRequestEntity, { onDelete: 'CASCADE' })
  billRequest?: BillRequestEntity;

  @Column()
  ftsAccountId!: string;

  @ManyToOne(() => FtsAccountEntity, { onDelete: 'CASCADE' })
  ftsAccount?: FtsAccountEntity;
}
