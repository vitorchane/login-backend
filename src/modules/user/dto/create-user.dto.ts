import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { IsValidCountry } from 'src/common/validators/country/country.validator';
import { IsValidDocumentByCountry } from 'src/common/validators/document-by-country/document-by-country.validator';

export class CreateUserDTO {
  @IsEmail({}, { message: 'Email deve ser um endereço de email válido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @IsValidCountry({
    message: 'País deve ser um código ISO válido (ex: BR, US)',
  })
  @IsNotEmpty({ message: 'País é obrigatório' })
  country: string;

  @IsValidDocumentByCountry({
    message: 'Documento inválido para o país selecionado',
  })
  @IsNotEmpty({ message: 'Documento é obrigatório' })
  document: string;

  @IsString({ message: 'Senha deve ser uma string' })
  @MinLength(6, { message: 'Senha deve ter no mínimo 6 caracteres' })
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  password: string;
}
