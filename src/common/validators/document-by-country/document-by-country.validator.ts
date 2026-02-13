import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { IsCPFConstraint } from '../cpf/cpf.validator';
import { IsValidDocumentConstraint } from '../document/document.validator';

@ValidatorConstraint({ name: 'isValidDocumentByCountry', async: false })
export class IsValidDocumentByCountryConstraint implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments): boolean {
    const object = args.object as any;
    const country = object.country?.toUpperCase().trim();

    if (!value || !country) return false;

    if (country === 'BR') {
      // Para Brasil, validar como CPF
      const cpfValidator = new IsCPFConstraint();
      return cpfValidator.validate(value);
    } else {
      // Para outros países, validar como documento estrangeiro
      const documentValidator = new IsValidDocumentConstraint();
      return documentValidator.validate(value);
    }
  }

  defaultMessage(args: ValidationArguments): string {
    const object = args.object as any;
    const country = object.country?.toUpperCase().trim();

    if (country === 'BR') {
      return 'Para Brasil, o documento deve ser um CPF válido';
    } else {
      return 'Para país estrangeiro, o documento deve ter entre 3 e 50 caracteres';
    }
  }
}

export function IsValidDocumentByCountry(
  validationOptions?: ValidationOptions,
) {
  return function (target: object, propertyName: string) {
    registerDecorator({
      target: target.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidDocumentByCountryConstraint,
    });
  };
}
