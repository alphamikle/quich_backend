import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BillEntity } from '../../bill/entities/bill.entity';

@Entity()
export class ShopEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column()
  address!: string;

  @Column({ type: 'float', nullable: true })
  longitude?: number;

  @Column({ type: 'float', nullable: true })
  latitude?: number;

  @Column({ nullable: true })
  tin?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => BillEntity, bill => bill.shop)
  bills?: BillEntity[];
}
