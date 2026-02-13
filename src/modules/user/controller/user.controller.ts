import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { CreateUserDTO } from '../dto/create-user.dto';
import { UserService } from '../service/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() dto: CreateUserDTO) {
    try {
      const user = await this.userService.createUser(dto);

      return {
        message: 'Usuário criado com sucesso',
        data: user,
      };
    } catch (error) {
      throw new HttpException(
        'Erro ao criar usuário',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
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
