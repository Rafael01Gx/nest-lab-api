import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SignUpDto } from '../auth/dto/signup.dto';
import { HashingServiceProtocol } from '../auth/hash/hashing.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserPayload } from '../auth/types/user-payload.type';
import { UserRepository } from './repositories/user.repository';

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
      return { message: 'Usuário criado com sucesso.' };
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

  async update(id: string, user: UserPayload, updateUser: UpdateUserDto) {
    if (user.sub !== id) {
      throw new HttpException(
        'Você não tem permissão para atualizar esse usuário.',
        HttpStatus.UNAUTHORIZED,
      );
    }
    try {
      const userExist = await this.userRepository.getById(id);
      if (!userExist) {
        throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
      }
      if (updateUser.authorization) delete updateUser.authorization;
      if (updateUser.role) delete updateUser.role;
      await this.userRepository.update(id, updateUser);
      return { message: 'Usuário atualizado com sucesso.' };
    } catch (err) {
      console.log(err);
      throw new HttpException(
        'Ocorreu um erro inesperado ao atualizar o usuário.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async delete(id: string) {
    try {
      const userExist = await this.userRepository.getById(id);
      if (!userExist) {
        throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
      }
      await this.userRepository.delete(id);
      return { message: 'Usuário deletado com sucesso.' };
    } catch (err) {
      console.log(err);
      throw new HttpException(
        'Ocorreu um erro inesperado ao deletar o usuário.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async updateStatusAndRole(id: string, user: UpdateUserDto) {
    try {
      const userExist = await this.userRepository.getById(id);
      if (!userExist) {
        throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
      }

      await this.userRepository.update(id, {
        authorization: user.authorization,
        role: user.role,
      });
      return { message: 'Usuário atualizado com sucesso.' };
    } catch (err) {
      console.log(err);
      throw new HttpException(
        'Ocorreu um erro inesperado ao atualizar o usuário.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
