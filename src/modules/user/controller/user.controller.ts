import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDTO } from '../dto/create-user.dto';
import { UserService } from '../service/user.service';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar novo usuário' })
  @ApiBody({
    type: CreateUserDTO,
    examples: {
      example1: {
        value: {
          email: 'john@example.com',
          country: 'US',
          document: 'ABC12345',
          password: 'password123',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Validação falhou' })
  @ApiResponse({ status: 409, description: 'Email já cadastrado' })
  async createUser(@Body() dto: CreateUserDTO) {
    try {
      const user = await this.userService.createUser(dto);

      return {
        message: 'Usuário criado com sucesso',
        data: user,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new HttpException(
        'Erro ao criar usuário',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todos os usuários' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuários retornada com sucesso',
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async getUsers() {
    try {
      const users = await this.userService.getUsers();

      return {
        message: 'Usuários encontrados',
        data: users,
        total: users.length,
      };
    } catch (error) {
      throw new HttpException(
        'Erro ao buscar usuários',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter usuário por ID' })
  @ApiParam({ name: 'id', description: 'UUID do usuário', type: 'string' })
  @ApiResponse({ status: 200, description: 'Usuário encontrado' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async getUserById(@Param('id') id: string) {
    try {
      const user = await this.userService.getUserById(id);
      return {
        message: 'Usuário encontrado',
        data: user,
      };
    } catch (error) {
      if (error.message === 'Usuário não encontrado') {
        throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Erro ao buscar usuário',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
