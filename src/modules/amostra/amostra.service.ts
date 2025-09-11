import { HttpException, Injectable } from '@nestjs/common';
import { UpdateAmostraDto } from './dto/update-amostra.dto';
import { CreateAmostraDto } from './dto/create-amostra.dto';
import { AmostraRepository } from './repositories/amostra.repository';
import { IAmostra } from './interfaces/amostra.interface';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AmostraService {
  constructor(private readonly amostraRepository: AmostraRepository) {}

  findAll(): Promise<IAmostra[]> {
    return this.amostraRepository.findAll();
  }

  findAllByUser(user: User): Promise<IAmostra[]> {
    if (!user || !user.id) {
      throw new HttpException('User ID is required', 400);
    }
    return this.amostraRepository.findAllByUser(user.id);
  }

  create(dto: CreateAmostraDto) {
    return dto;
  }

  update(id: number, dto: UpdateAmostraDto) {
    return { id, dto };
  }

  delete(id: number) {
    return id;
  }
}
