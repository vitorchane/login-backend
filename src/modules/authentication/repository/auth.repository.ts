import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDTO } from '../dto/login.dto';

@Injectable()
export class AuthRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findUserByEmail(email: string) {
    try {
      return await this.prismaService.user.findUnique({
        where: { email },
      });
    } catch (error) {
      console.error(`Erro ao buscar usuário por email: ${error}`);
      throw error;
    }
  }

  async verifyUserExists(email: string): Promise<boolean> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { email },
      });
      return !!user;
    } catch (error) {
      console.error(`Erro ao verificar existência do usuário: ${error}`);
      return false;
    }
  }
}
