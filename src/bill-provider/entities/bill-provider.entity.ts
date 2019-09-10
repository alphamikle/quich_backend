import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BillRequestEntity } from '../../bill-request/entities/bill-request.entity';

/**
 * @description Справочник провайдеров данных о чеках - ФНС и различные ОФД
 */
@Entity()
export class BillProviderEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  title!: string;

  @OneToMany(() => BillRequestEntity, billRequest => billRequest.billProvider)
  billRequests?: BillRequestEntity[];
}
