import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';
import { PurchaseEntity } from '../../purchase/entities/purchase.entity';
import { CategoryToUserEntity } from './category-to-user.entity';

@Entity()
export class CategoryEntity {
  @ApiModelProperty()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiModelProperty()
  @Column()
  title!: string;

  @OneToMany(() => PurchaseEntity, purchase => purchase.category)
  purchases?: PurchaseEntity[];

  @OneToMany(() => CategoryToUserEntity, categoryToUser => categoryToUser.category)
  categoriesToUsers?: CategoryToUserEntity[];
}
