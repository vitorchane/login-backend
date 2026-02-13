import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDTO } from '../dto/login.dto';
import { AuthService } from '../service/auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Realizar login e obter JWT token' })
  @ApiBody({ type: LoginDTO })
  @ApiResponse({ status: 200, description: 'Login realizado com sucesso' })
  @ApiResponse({ status: 400, description: 'Email e senha são obrigatórios' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  async login(@Body() dto: LoginDTO) {
    try {
      if (!dto.email || !dto.password) {
        throw new BadRequestException('Email e senha são obrigatórios');
      }

      const result = await this.authService.login(dto);

      return {
        message: 'Login realizado com sucesso',
        data: result,
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      throw new HttpException(
        'Erro ao realizar login',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
