import { ValidationError } from 'class-validator';

export enum Fields {
  EMAIL = 'email',
  PHONE = 'phone',
  PASSWORD = 'password',
  PUSH = 'push',
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
    return this.manual(message, Fields.PUSH);
  }

  static fromObject(object: { [property: string]: string }): PropertyError[] {
    const properties = Object.keys(object);
    const errors: PropertyError[] = [];
    for (const property of properties) {
      errors.push(PropertyError.manual(object[property], property));
    }
    return errors;
  }

  static manual(message: string, property: string): PropertyError {
    const propertyError = new PropertyError();
    propertyError.message = message;
    propertyError.property = property;
    return propertyError;
  }
}