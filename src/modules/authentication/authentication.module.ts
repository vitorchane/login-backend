import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthController } from './controller/auth.controller';
import { AuthRepository } from './repository/auth.repository';
import { AuthService } from './service/auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'Sua chave secreta',
      signOptions: {
        expiresIn: '24h',
      },
    }),
    PrismaModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthenticationModule {}
