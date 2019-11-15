import { EmailContentEntity } from '../entities/email-content.entity';

export const PASSWORD_VARIABLE = '${password}';

// ? Restore password
export const RESTORE_ENTITY_CODE = 'restorePassword';
const RESTORE_ENTITY = EmailContentEntity.createFrom(RESTORE_ENTITY_CODE,
  'Восстановление пароля',
  `Ваш новый пароль: ${PASSWORD_VARIABLE}`,
  'restore@quich.ru',
);

export const REQUIRED_ENTITIES = [ RESTORE_ENTITY ];
