import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepository } from '../repository/user.repository';
import * as bcrypt from 'bcrypt';

describe('UserService', () => {
  let service: UserService;
  let repository: UserRepository;

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    country: 'BR',
    document: '12345678910',
    password: 'hashedPassword',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepository = {
    createUser: jest.fn(),
    getUsers: jest.fn(),
    getUserById: jest.fn(),
    getUserByEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<UserRepository>(UserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a user with hashed password', async () => {
      const dto = {
        email: 'newuser@example.com',
        password: 'password123',
        country: 'BR',
        document: '12345678910',
      };

      mockRepository.getUserByEmail.mockResolvedValueOnce(null);
      jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce('hashedPassword' as any);
      mockRepository.createUser.mockResolvedValueOnce({
        ...mockUser,
        email: dto.email,
      });

      const result = await service.createUser(dto);

      expect(result.email).toBe(dto.email);
      expect(mockRepository.createUser).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 10);
    });

    it('should throw ConflictException when email already exists', async () => {
      const dto = {
        email: 'existing@example.com',
        password: 'password123',
        country: 'BR',
        document: '12345678910',
      };

      mockRepository.getUserByEmail.mockResolvedValueOnce(mockUser);

      await expect(service.createUser(dto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('getUsers', () => {
    it('should return all users', async () => {
      const users = [mockUser];

      mockRepository.getUsers.mockResolvedValueOnce(users);

      const result = await service.getUsers();

      expect(result).toEqual(users);
      expect(mockRepository.getUsers).toHaveBeenCalled();
    });
  });

  describe('getUserById', () => {
    it('should return a user by id', async () => {
      mockRepository.getUserById.mockResolvedValueOnce(mockUser);

      const result = await service.getUserById('1');

      expect(result).toEqual(mockUser);
      expect(mockRepository.getUserById).toHaveBeenCalledWith('1');
    });

    it('should throw error when user not found', async () => {
      mockRepository.getUserById.mockResolvedValueOnce(null);

      await expect(service.getUserById('nonexistent')).rejects.toThrow(
        'Usuário não encontrado',
      );
    });
  });
});
