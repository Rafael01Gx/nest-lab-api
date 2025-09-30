import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SignUpDto } from '../auth/dto/signup.dto';
import { HashingServiceProtocol } from '../auth/hash/hashing.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './repositories/user.repository';
import { User } from './entities/user.entity';
import { Role } from '@prisma/client';

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

  async update(
    id: string,
    user: User,
    updateUser: UpdateUserDto,
  ): Promise<User> {
    if (user.id !== id) {
      throw new HttpException(
        'Você não tem permissão para atualizar esse usuário.',
        HttpStatus.UNAUTHORIZED,
      );
    }
    try {
      const userExist = await this.userRepository.findByEmail(user.email);
      if (!userExist) {
        throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
      }
      const _updateUser = {
        name: updateUser.name ? updateUser.name : userExist.name,
        phone: updateUser.phone ? updateUser.phone : userExist.phone || '',
        area: updateUser.area ? updateUser.area : userExist.area || '',
        funcao: updateUser.funcao ? updateUser.funcao : userExist.funcao || '',
      };
      if (updateUser.oldPassword && updateUser.password) {
        if (
          !(await this.hashingService.compare(
            updateUser.oldPassword,
            userExist.password,
          ))
        ) {
          throw new HttpException(
            'Invalid email or password',
            HttpStatus.UNAUTHORIZED,
          );
        }
        _updateUser['password'] = await this.hashingService.hash(
          updateUser.password,
        );
      }
      return this.userRepository.update(id, _updateUser);
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
      if (user.role == Role.ADMIN) {
        if (user.authorization !== true) {
          throw new HttpException(
            'Um Administrador não pode ter a AUTORIZAÇÃO removida !',
            HttpStatus.NOT_FOUND,
          );
        }
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
