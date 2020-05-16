import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Bill } from '~/bill/entities/bill.entity';
import * as shop from '~/proto-generated/shop';

@Entity('shop_entity')
export class Shop implements shop.Shop {

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ type: 'float', nullable: true })
  longitude?: number;

  @Column({ type: 'float', nullable: true })
  latitude?: number;

  @Column({ nullable: true })
  tin?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => Bill, bill => bill.shop)
  bills?: Bill[];
}
