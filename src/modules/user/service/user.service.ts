import { Injectable } from '@nestjs/common';
import { CreateUserDTO } from '../dto/create-user.dto';
import { UserRepository } from '../repository/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(dto: CreateUserDTO) {
    try {
      return await this.userRepository.createUser(dto);
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
