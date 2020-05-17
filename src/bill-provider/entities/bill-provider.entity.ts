import 'reflect-metadata';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BillRequest } from '~/bill-request/entities/bill-request.entity';

export enum ProviderCode {
  FTS,
  FIRST_OFD,
  OFD,
  TAXCOM,
}

// TODO: Прописать провайдеров для всех ОФД
/**
 * @description Справочник провайдеров данных о чеках - ФНС и различные ОФД
 */
@Entity('bill_provider_entity')
export class BillProvider {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ enum: Object.values(ProviderCode), nullable: true })
  title!: ProviderCode;

  @OneToMany(() => BillRequest, billRequest => billRequest.billProvider)
  billRequests?: BillRequest[];
}
