import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { MateriaPrimaService } from './materia-prima.service';
import { MateriaPrimaDto } from './dto/materia-prima.dto';

@Controller('materia-prima')
export class MateriaPrimaController {
  constructor(private readonly materiaPrimaService: MateriaPrimaService) {}

  @Get()
  findAll() {
    return this.materiaPrimaService.findAll();
  }
  @Post()
  create(@Body() dto: MateriaPrimaDto) {
    return this.materiaPrimaService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: MateriaPrimaDto) {
    return this.materiaPrimaService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.materiaPrimaService.delete(id);
  }
}
