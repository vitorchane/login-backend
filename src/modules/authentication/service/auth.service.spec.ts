import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { AuthRepository } from '../repository/auth.repository';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let repository: AuthRepository;
  let jwtService: JwtService;

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    password: 'hashedPassword',
    country: 'BR',
    document: '12345678910',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepository = {
    findUserByEmail: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: AuthRepository,
          useValue: mockRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    repository = module.get<AuthRepository>(AuthRepository);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const dto = {
        email: 'test@example.com',
        password: 'password123',
      };

      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true as boolean);
      mockRepository.findUserByEmail.mockResolvedValueOnce(mockUser);
      mockJwtService.sign.mockReturnValueOnce('token123');

      const result = await service.login(dto);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('user');
      expect(result.user.email).toBe(mockUser.email);
      expect(mockRepository.findUserByEmail).toHaveBeenCalledWith(dto.email);
    });

    it('should throw UnauthorizedException when user not found', async () => {
      const dto = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      mockRepository.findUserByEmail.mockResolvedValueOnce(null);

      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when password is wrong', async () => {
      const dto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false as any);
      mockRepository.findUserByEmail.mockResolvedValueOnce(mockUser);

      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw BadRequestException when email is missing', async () => {
      const dto = {
        email: '',
        password: 'password123',
      };

      await expect(service.login(dto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when password is missing', async () => {
      const dto = {
        email: 'test@example.com',
        password: '',
      };

      await expect(service.login(dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('validateToken', () => {
    it('should validate a valid token', async () => {
      const token = 'valid-token';
      const payload = { sub: '1', email: 'test@example.com' };

      mockJwtService.verify.mockReturnValueOnce(payload);

      const result = await service.validateToken(token);

      expect(result).toEqual(payload);
      expect(mockJwtService.verify).toHaveBeenCalledWith(token);
    });

    it('should throw UnauthorizedException for invalid token', async () => {
      const token = 'invalid-token';

      mockJwtService.verify.mockImplementationOnce(() => {
        throw new Error('Invalid token');
      });

      await expect(service.validateToken(token)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
