import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiModelProperty }                                                              from '@nestjs/swagger';
import { UserEntity }                                                                    from './user.entity';

@Entity()
export class FtsAccountEntity {
  @ApiModelProperty()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiModelProperty()
  @Column()
  phone!: string;

  @ApiModelProperty({ format: 'password' })
  @Column()
  password!: string;

  @ApiModelProperty()
  @Column({ default: false })
  isMain!: boolean;

  @ApiModelProperty()
  @Column()
  userId!: string;

  @ManyToOne(() => UserEntity, user => user.ftsAccounts, { onDelete: 'CASCADE' })
  user?: UserEntity;

  @BeforeInsert()
  @BeforeUpdate()
  makePhoneCorrect() {
    this.phone = this.phone
      .replace(/\D/g, '')
      .replace(/^8/, '7')
      .replace(/^7/, '+7')
    ;
  }
}
