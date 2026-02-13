import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

// Lista de códigos de país ISO 3166-1 alpha-2 (padrão internacional)
const VALID_COUNTRIES = [
  'BR', 'US', 'CA', 'GB', 'FR', 'DE', 'ES', 'IT', 'PT', 'NL', 'BE', 'CH',
  'AT', 'SE', 'NO', 'DK', 'FI', 'PL', 'CZ', 'SK', 'HU', 'RO', 'GR', 'TR',
  'RU', 'UA', 'KZ', 'CN', 'JP', 'KR', 'IN', 'PK', 'BD', 'TH', 'VN', 'ID',
  'MY', 'SG', 'PH', 'AU', 'NZ', 'ZA', 'EG', 'NG', 'MX', 'AR', 'CL', 'CO',
  'PE', 'VE', 'CU', 'JM', 'CW', 'AE', 'SA', 'IL', 'IR', 'IQ',
];

@ValidatorConstraint({ name: 'isValidCountry', async: false })
export class IsValidCountryConstraint implements ValidatorConstraintInterface {
  validate(value: string): boolean {
    if (!value) return false;

    const country = value.toUpperCase().trim();
    return VALID_COUNTRIES.includes(country);
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} deve ser um código de país ISO válido (ex: BR, US, DE)`;
  }
}

export function IsValidCountry(validationOptions?: ValidationOptions) {
  return function (target: object, propertyName: string) {
    registerDecorator({
      target: target.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidCountryConstraint,
    });
  };
}
