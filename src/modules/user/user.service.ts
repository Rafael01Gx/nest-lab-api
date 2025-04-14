import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { SignUpDto } from '../auth/dto/signup.dto';
import { HashingServiceProtocol } from '../auth/hash/hashing.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashingService: HashingServiceProtocol,
  ) {}

  async create(user: SignUpDto) {
    try {
      const userExist = await this.userRepository.findByEmail(user.email);
      if (userExist) {
        throw new HttpException('Email já cadastrado', HttpStatus.CONFLICT);
      }
      user.password = await this.hashingService.hash(user.password);
      await this.userRepository.create(user);
      return 'Usuário criado com sucesso.';
    } catch (err) {
      console.log(err);
      throw new HttpException(
        'Ocorreu um erro inesperado ao criar o usuário.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAll() {
    try {
      return await this.userRepository.getAll();
    } catch (err) {
      console.log(err);
      throw new HttpException(
        'Ocorreu um erro inesperado ao buscar os usuários.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getById(id: string) {
    try {
      const user = await this.userRepository.getById(id);
      if (!user) {
        throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (err) {
      console.log(err);
      throw new HttpException(
        'Ocorreu um erro inesperado ao buscar o usuário.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, user: UpdateUserDto) {
    try {
      const userExist = await this.userRepository.getById(id);
      if (!userExist) {
        throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
      }
      return await this.userRepository.update(id, user);
    } catch (err) {
      console.log(err);
      throw new HttpException(
        'Ocorreu um erro inesperado ao atualizar o usuário.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
