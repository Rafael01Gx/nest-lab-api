import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { MateriaPrimaService } from './materia-prima.service';
import { MateriaPrimaDto } from './dto/materia-prima.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Roles(Role.ADMIN, Role.OPERADOR)
@Controller('materias-primas')
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
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: MateriaPrimaDto) {
    return this.materiaPrimaService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.materiaPrimaService.delete(id);
  }
}
