import { Injectable, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO } from '../dto/create-user.dto';
import { UserRepository } from '../repository/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(dto: CreateUserDTO) {
    try {
      // Verificar se email já existe
      const existingUser = await this.userRepository.getUserByEmail(dto.email);
      if (existingUser) {
        throw new ConflictException('Email já cadastrado');
      }

      // Hash da senha
      const hashedPassword = await bcrypt.hash(dto.password, 10);

      return await this.userRepository.createUser({
        ...dto,
        password: hashedPassword,
      });
    } catch (error) {
      console.error(`Erro ao criar usuário: ${error}`);
      throw error;
    }
  }

  async getUsers() {
    try {
      return await this.userRepository.getUsers();
    } catch (error) {
      console.error(`Erro ao buscar usuários: ${error}`);
      throw error;
    }
  }

  async getUserById(id: string) {
    try {
      const user = await this.userRepository.getUserById(id);

      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      return user;
    } catch (error) {
      console.error(`Erro ao buscar usuário por ID: ${error}`);
      throw error;
    }
  }
}
