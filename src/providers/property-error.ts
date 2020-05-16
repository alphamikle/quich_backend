import { ValidationError } from 'class-validator';

export enum Fields {
  EMAIL = 'email',
  PHONE = 'phone',
  PASSWORD = 'password',
  NOTIFICATION = 'notification',
}

export class PropertyError {
  property!: string;

  message!: string;

  static fromValidationError(validationError: ValidationError): PropertyError {
    const propertyError = new PropertyError();
    propertyError.property = validationError.property;
    propertyError.message = 'Неизвестная ошибка';
    const keys = Object.getOwnPropertyNames(validationError.constraints);
    if (keys.length > 0) {
      propertyError.message = (validationError.constraints as Record<string, string>)[keys[0]];
    }
    return propertyError;
  }

  static fromString(message: string): PropertyError {
    return this.manual(message, Fields.NOTIFICATION);
  }

  static manual(message: string, property: string): PropertyError {
    const propertyError = new PropertyError();
    propertyError.message = message;
    propertyError.property = property;
    return propertyError;
  }
}