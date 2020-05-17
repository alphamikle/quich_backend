import { AfterLoad, BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '~/user/entities/user.entity';
import * as fts from '~/proto-generated/fts';

@Entity('fts_account_entity')
export class FtsAccount implements fts.FtsAccount {

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  phone!: string;

  @Column()
  password!: string;

  @Column()
  userId!: string;

  @Column({ default: () => 'now()' })
  lastUsingDate!: Date;

  @ManyToOne(() => User, user => user.ftsAccounts, { onDelete: 'CASCADE' })
  user?: User;

  @BeforeInsert()
  @BeforeUpdate()
  makePhoneCorrect() {
    this.phone = this.phone
      .replace(/\D/g, '')
      .replace(/^8/, '7')
      .replace(/^7/, '+7')
    ;
  }

  @AfterLoad()
  updateLastUsingDate() {
    this.lastUsingDate = new Date();
  }
}
