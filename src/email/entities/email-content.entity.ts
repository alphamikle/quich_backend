import 'reflect-metadata';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('email_content_entity')
export class EmailContent {
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

  static createFrom(code: string, title: string, content: string, from: string): EmailContent {
    const entity: EmailContent = new EmailContent();
    entity.code = code;
    entity.title = title;
    entity.content = content;
    entity.from = from;
    return entity;
  }
}
