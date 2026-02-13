import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDTO } from '../dto/login.dto';
import { AuthRepository } from '../repository/auth.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDTO) {
    if (!dto.email || !dto.password) {
      throw new BadRequestException(
        'Email e senha são obrigatórios',
      );
    }

    const user = await this.authRepository.findUserByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      country: user.country,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '24h',
    });

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        country: user.country,
      },
    };
  }

  async validateToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }
}
