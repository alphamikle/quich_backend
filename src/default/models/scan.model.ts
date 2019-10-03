import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'scan' })
export class ScanModel {

  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Column({ type: 'json' })
  data: any;

  @Column({ default: new Date() })
  createdAt: Date;

}
