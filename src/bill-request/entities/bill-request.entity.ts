import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { BillEntity } from '../../bill/entities/bill.entity';
import { BillProviderEntity } from '../../bill-provider/entities/bill-provider.entity';
import { FtsFetchResponseBill } from '../../fts/dto/fts-fetch-response/bill.dto';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

@Entity()
export class BillRequestEntity {
  @ApiModelProperty()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiModelProperty()
  @Column()
  fiscalProp!: string;

  @ApiModelProperty()
  @Column()
  fiscalNumber!: string;

  @ApiModelProperty()
  @Column()
  fiscalDocument!: string;

  @ApiModelProperty({ type: 'integer' })
  @Column({ default: 1, type: 'int' })
  fetchingIterations!: number;

  @ApiModelProperty({ type: String, format: 'date-time' })
  @Column()
  billDate!: Date;

  @ApiModelProperty({ format: 'double' })
  @Column({ type: 'real' })
  totalSum!: number;

  @Column({ type: 'jsonb', nullable: true })
  rawData?: FtsFetchResponseBill;

  @ApiModelProperty()
  @Column({ default: false })
  isFetched!: boolean;

  @ApiModelProperty()
  @Column({ default: false })
  isChecked!: boolean;

  @ApiModelProperty({ type: String, format: 'date-time' })
  @CreateDateColumn()
  createdAt!: Date;

  @ApiModelProperty({ type: String, format: 'date-time' })
  @UpdateDateColumn()
  updateAt!: Date;

  @ApiModelProperty()
  @Column()
  userId!: string;
  @ManyToOne(() => UserEntity, user => user.billRequests)
  user?: UserEntity;

  @ApiModelPropertyOptional()
  @Column({ nullable: true })
  billId?: string;
  @ManyToOne(() => BillEntity, bill => bill.billRequests, { onDelete: 'CASCADE' })
  bill?: BillEntity;

  @ApiModelPropertyOptional()
  @Column({ nullable: true })
  billProviderId?: string;
  @ManyToOne(() => BillProviderEntity, billProvider => billProvider.billRequests)
  billProvider?: BillProviderEntity;
}
