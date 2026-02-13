import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isValidDocument', async: false })
export class IsValidDocumentConstraint implements ValidatorConstraintInterface {
  validate(value: string): boolean {
    if (!value) return false;

    // Remove caracteres especiais
    const document = value.replace(/[^\w\s-]/g, '');

    // Documento estrangeiro deve ter pelo menos 3 caracteres
    // Aceita números, letras e alguns caracteres especiais comuns
    // Exemplos: "12345678", "AB123456789", "A-1234567"
    return document.length >= 3 && document.length <= 50;
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} deve ser um documento válido (entre 3 e 50 caracteres)`;
  }
}

export function IsValidDocument(validationOptions?: ValidationOptions) {
  return function (target: object, propertyName: string) {
    registerDecorator({
      target: target.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidDocumentConstraint,
    });
  };
}
