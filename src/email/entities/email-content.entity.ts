import 'reflect-metadata';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EmailContentEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  code!: string;

  @Column()
  title: string;

  @Column()
  from: string;

  @Column()
  content: string;

  static createFrom(code: string, title: string, content: string, from: string): EmailContentEntity {
    const entity: EmailContentEntity = new EmailContentEntity();
    entity.code = code;
    entity.title = title;
    entity.content = content;
    entity.from = from;
    return entity;
  }
}
