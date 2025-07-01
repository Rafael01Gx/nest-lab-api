import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MateriaPrimaRepository } from './repositories/materia-prima.repository';
import { IMateriaPrima } from './interfaces/materia-prima.interface';

@Injectable()
export class MateriaPrimaService {
  constructor(private readonly materiaPrimaRepo: MateriaPrimaRepository) {}

  async findAll(): Promise<IMateriaPrima[]> {
    return this.materiaPrimaRepo.findAll();
  }

  async create(dto: IMateriaPrima) {
    return this.materiaPrimaRepo.create(dto);
  }

  async update(id: string, dto: IMateriaPrima) {
    const existingMateriaPrima = await this.materiaPrimaRepo.findById(id);
    if (!existingMateriaPrima) {
      throw new HttpException(
        'Matéria-prima não encontrada !',
        HttpStatus.NOT_FOUND,
      );
    }
    const updateDto = {
      nome_descricao: dto.nome_descricao,
      classe_tipo: dto.classe_tipo,
    };
    return this.materiaPrimaRepo.update(id, updateDto);
  }

  async delete(id: string) {
    await this.materiaPrimaRepo.delete(id);
    return {
      message: 'Matéria-prima deletada com sucesso!',
    };
  }
}
