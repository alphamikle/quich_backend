import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity()
export class FtsAccountEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  phone!: string;

  @Column()
  password!: string;

  @Column({ default: false })
  isMain!: boolean;

  @Column({ type: 'string' })
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
