import 'reflect-metadata';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from '~/user/entities/user';
import { Bill } from '~/bill/entities/bill.entity';
import { BillProvider } from '~/bill-provider/entities/bill-provider.entity';
import { FtsFetchResponseBill } from '~/fts/dto/fts-fetch-response/bill.dto';
import { BillDto } from '~/bill/dto/bill.dto';

@Entity('bill_request_entity')
export class BillRequest {

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  fiscalProp!: string;

  @Column()
  fiscalNumber!: string;

  @Column()
  fiscalDocument!: string;

  @Column({ default: 1, type: 'int' })
  fetchingIterations!: number;

  @Column()
  billDate!: Date;

  @Column({ type: 'real' })
  totalSum!: number;

  @Column({ type: 'jsonb', nullable: true })
  rawData?: BillDto;

  @Column({ type: 'jsonb', nullable: true })
  ftsData?: FtsFetchResponseBill;

  @Column({ default: false })
  isFetched!: boolean;

  @Column({ default: false })
  isChecked!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updateAt!: Date;

  @Column()
  userId!: string;

  @ManyToOne(() => User, user => user.billRequests)
  user?: User;

  @Column({ nullable: true })
  billId?: string;

  @ManyToOne(() => Bill, bill => bill.billRequests, { onDelete: 'CASCADE' })
  bill?: Bill;

  @Column({ nullable: true })
  billProviderId?: string;

  @ManyToOne(() => BillProvider, billProvider => billProvider.billRequests, { nullable: true, onDelete: 'SET NULL' })
  billProvider?: BillProvider;
}
