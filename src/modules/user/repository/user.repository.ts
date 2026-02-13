import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDTO } from '../dto/create-user.dto';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(dto: CreateUserDTO) {
    try {
      return await this.prismaService.user.create({
        data: {
          email: dto.email,
          password: dto.password,
          document: dto.document,
          country: dto.country.toUpperCase(),
          updatedAt: new Date(),
        },
        select: {
          id: true,
          email: true,
          country: true,
          document: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      console.error(`Erro ao criar usuário no banco de dados: ${error}`);
      throw error;
    }
  }

  async getUsers() {
    try {
      return await this.prismaService.user.findMany({
        select: {
          id: true,
          email: true,
          country: true,
          document: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      console.error(`Erro ao buscar usuários no banco de dados: ${error}`);
      throw error;
    }
  }

  async getUserById(id: string) {
    try {
      return await this.prismaService.user.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          email: true,
          country: true,
          document: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      console.error(
        `Erro ao buscar usuário por ID no banco de dados: ${error}`,
      );
      throw error;
    }
  }

  async getUserByEmail(email: string) {
    try {
      return await this.prismaService.user.findUnique({
        where: {
          email,
        },
      });
    } catch (error) {
      console.error(
        `Erro ao buscar usuário por email no banco de dados: ${error}`,
      );
      throw error;
    }
  }
}
