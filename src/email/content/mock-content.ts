import { EmailContent } from '~/email/entities/email-content.entity';

const { MAIL_USERNAME } = process.env;

// eslint-disable-next-line no-template-curly-in-string
export const PASSWORD_VARIABLE = '${password}';

// ? Restore password
export const RESTORE_ENTITY_CODE = 'restorePassword';
const RESTORE_ENTITY = EmailContent.createFrom(
  RESTORE_ENTITY_CODE,
  'Восстановление пароля',
  `Ваш новый пароль: ${ PASSWORD_VARIABLE }`,
  MAIL_USERNAME,
);

export const REQUIRED_ENTITIES = [RESTORE_ENTITY];
