import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiModelProperty, ApiModelPropertyOptional }                          from '@nestjs/swagger';
import { BillEntity }                                                          from '../../bill/entities/bill.entity';

@Entity()
export class ShopEntity {
  @ApiModelProperty()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiModelProperty()
  @Column()
  title!: string;

  @ApiModelPropertyOptional()
  @Column({ nullable: true })
  address?: string;

  @ApiModelPropertyOptional({ format: 'double' })
  @Column({
    type: 'float',
    nullable: true,
  })
  longitude?: number;

  @ApiModelPropertyOptional({ format: 'double' })
  @Column({
    type: 'float',
    nullable: true,
  })
  latitude?: number;

  @ApiModelPropertyOptional()
  @Column({ nullable: true })
  tin?: string;

  @ApiModelProperty({
    type: String,
    format: 'date-time',
  })
  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => BillEntity, bill => bill.shop)
  bills?: BillEntity[];
}
