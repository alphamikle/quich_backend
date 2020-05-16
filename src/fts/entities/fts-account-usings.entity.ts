import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class FtsAccountUsings {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  phone!: string;

  @Column({
    type: 'integer',
    default: 0,
  })
  uses!: number;

  @Column({ type: 'date' })
  usingDay!: Date;
}
