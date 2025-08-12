import { Injectable } from '@nestjs/common';
import { UpdateAmostraDto } from './dto/update-amostra.dto';
import { CreateAmostraDto } from './dto/create-amostra.dto';

@Injectable()
export class AmostraService {
  findAll() {
    return null;
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
