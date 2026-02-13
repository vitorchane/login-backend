import { Injectable } from '@nestjs/common';
import { UUID } from 'crypto';
import { LoggingService } from 'src/modules/common/logging/logging.service';
import { handlePrismaError } from 'src/prisma/handle-prisma-error';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateQuestionPlaylistDto } from '../dto/create-question-playlist.dto';
import { UpdateQuestionPlaylistDto } from '../dto/update-question-playlist.dto';

@Injectable()
export class QuestionPlaylistsRepository {
  constructor(
    private readonly prismaService: PrismaService,
  ) {}

  // Criar Playlist Manual (Vazia)
  async createUser(dto: createUserDTO) {
    try {
        return await this.prismaService.user.create({data: {
            email: dto.email,
            password: dto.password,
            document: dto.document,
            country: dto.country,
            updatedAt: new Date(),
        }})
    } catch (error) {
        console.error(`Erro ao criar usuário no banco de dados: ${error}`);
        handlePrismaError(error);
    }
  }
}
