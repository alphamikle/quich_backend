import { Injectable, Logger } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailContentEntity } from './entities/email-content.entity';
import { PASSWORD_VARIABLE, REQUIRED_ENTITIES, RESTORE_ENTITY_CODE } from './content/mock-content';

export interface EmailCredentials {
  host: string;
  port: number;
  username: string;
  password: string;
}

export interface UsualEmailData {
  to: string;
  from: string;
  title: string;
}

export interface TextEmailCredentials extends UsualEmailData {
  text: string;
}

export interface HtmlEmailCredentials extends UsualEmailData {
  html: string;
}

export interface RestoreEmailCredentials {
  to: string;
}

const { MAIL_SMTP_HOST, MAIL_SMTP_PORT, MAIL_USERNAME, MAIL_PASSWORD } = process.env;

@Injectable()
export class EmailService {
  private transport: Transporter;

  constructor(
    @InjectRepository(EmailContentEntity)
    private readonly emailContentEntityRepository: Repository<EmailContentEntity>,
  ) {
    this.initialize();
    this.initDefaultEntities()
      .then(() => Logger.log('Email entities synced', EmailService.name))
      .catch(err => {
        Logger.error(err.message, null, EmailService.name);
        process.exit(-1);
      });
  }

  initialize(credentials?: EmailCredentials): void {
    if (credentials === undefined) {
      credentials = {
        host: MAIL_SMTP_HOST,
        port: Number(MAIL_SMTP_PORT),
        username: MAIL_USERNAME,
        password: MAIL_PASSWORD,
      };
    } else {
      credentials.host = credentials.host || MAIL_SMTP_HOST;
      credentials.port = credentials.port || Number(MAIL_SMTP_PORT);
      credentials.username = credentials.username || MAIL_USERNAME;
      credentials.password = credentials.password || MAIL_PASSWORD;
    }
    this.transport = createTransport({
      host: credentials.host,
      port: credentials.port,
      secure: true,
      pool: true,
      auth: {
        user: credentials.username,
        pass: credentials.password,
      },
    });
  }

  async sendTextEmail({ to, from, text, title }: TextEmailCredentials): Promise<void> {
    await this.transport.sendMail({
      to,
      from,
      text,
      subject: title,
    });
  }

  async sendRestoreEmail({ credentials, newPassword }: { credentials: RestoreEmailCredentials; newPassword: string }): Promise<void> {
    const restoreContent = await this.getEmailContentEntityByCode(RESTORE_ENTITY_CODE);
    const text = this.replaceVars(restoreContent.content, PASSWORD_VARIABLE, newPassword);
    try {
      const config = {
        to: credentials.to,
        title: restoreContent.title,
        text,
        from: restoreContent.from,
      };
      Logger.log(config);
      await this.sendTextEmail(config);
    } catch (err) {
      Logger.error(err.message, err.stack, EmailService.name);
    }
  }

  async getEmailContentEntityByCode(code: string): Promise<EmailContentEntity> {
    return this.emailContentEntityRepository.findOne({ code });
  }

  async createEmailContentEntity(emailContentEntity: EmailContentEntity): Promise<EmailContentEntity> {
    return this.emailContentEntityRepository.save(emailContentEntity);
  }

  private async initDefaultEntities(): Promise<void> {
    const defaults = REQUIRED_ENTITIES;
    const dbDefaults = (await Promise.all(defaults.map(defaultEntity => this.getEmailContentEntityByCode(defaultEntity.code))))
      .filter(dbDefault => dbDefault !== undefined);
    const notSyncedDefaults = dbDefaults.length
      ? defaults.filter(defaultEntity => !dbDefaults.some(dbDefault => dbDefault.code === defaultEntity.code))
      : defaults;
    await Promise.all(notSyncedDefaults.map(defaultEntity => this.createEmailContentEntity(defaultEntity)));
  }

  private replaceVars(content: string, variable: string, replacer: string): string {
    return content.replace(variable, replacer);
  }
}
