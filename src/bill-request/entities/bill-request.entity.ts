import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { BillEntity } from '../../bill/entities/bill.entity';
import { BillProviderEntity } from '../../bill-provider/entities/bill-provider.entity';
import { FtsFetchResponseBill } from '../../fts/dto/fts-fetch-response/bill.dto';

@Entity()
export class BillRequestEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  fiscalProp!: string;

  @Column()
  fiscalNumber!: string;

  @Column()
  fiscalDocument!: string;

  @Column({ default: 1 })
  fetchingIterations!: number;

  @Column()
  billDate!: Date;

  @Column({ type: 'real' })
  totalSum!: number;

  @Column({ type: 'jsonb', nullable: true })
  rawData?: FtsFetchResponseBill;

  @Column({ default: false })
  isFetched!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updateAt!: Date;

  @Column()
  userId!: string;
  @ManyToOne(() => UserEntity, user => user.billRequests)
  user?: UserEntity;

  @Column({ nullable: true })
  billId?: string;
  @ManyToOne(() => BillEntity, bill => bill.billRequests)
  bill?: BillEntity;

  @Column({ nullable: true })
  billProviderId?: string;
  @ManyToOne(() => BillProviderEntity, billProvider => billProvider.billRequests)
  billProvider?: BillProviderEntity;
}
