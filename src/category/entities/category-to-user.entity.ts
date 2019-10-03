import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CategoryEntity } from './category.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

@Entity()
export class CategoryToUserEntity {
  static BLACK_COLOR = 4278190080;
  @ApiModelPropertyOptional()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiModelProperty({ type: 'integer' })
  @Column('bigint')
  color!: number;

  @ApiModelProperty()
  @Column()
  categoryId!: string;
  @ManyToOne(() => CategoryEntity, category => category.categoriesToUsers, { onDelete: 'RESTRICT' })
  category?: CategoryEntity;

  @ApiModelProperty()
  @Column()
  userId!: string;
  @ManyToOne(() => UserEntity, user => user.categoriesToUsers, { onDelete: 'CASCADE' })
  user?: UserEntity;
}
