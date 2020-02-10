import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiModelProperty }                                  from '@nestjs/swagger';
import { PurchaseEntity }                                    from '../../purchase/entities/purchase.entity';

@Entity()
export class ProductEntity {
  @ApiModelProperty()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiModelProperty()
  @Column({ unique: true })
  title!: string;

  @OneToMany(() => PurchaseEntity, purchase => purchase.product)
  purchases?: PurchaseEntity[];

  @ApiModelProperty({
    type: String,
    format: 'date-time',
  })
  @Column({ default: () => 'now()' })
  createdAt!: Date;
}
