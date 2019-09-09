import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BillEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  comment?: string;

  @Column({ type: 'real', default: 0 })
  totalSum: number;

  @Column()
  billDate: Date;
}
