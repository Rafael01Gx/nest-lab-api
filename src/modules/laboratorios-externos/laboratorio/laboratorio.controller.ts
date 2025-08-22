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
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { LaboratorioService } from './laboratorio.service';
import { CreateLaboratorioDto } from './dto/create-laboratorio.dto';
import { UpdateLaboratorioDto } from './dto/update-laboratorio.dto';

@Roles(Role.ADMIN, Role.OPERADOR)
@Controller('laboratorio-externo')
export class LaboratorioController {
  constructor(private readonly laboratorioService: LaboratorioService) {}

  @Get()
  findAll() {
    return this.laboratorioService.findAll();
  }

  @Post()
  create(@Body() dto: CreateLaboratorioDto) {
    return this.laboratorioService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateLaboratorioDto,
  ) {
    return this.laboratorioService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.laboratorioService.delete(id);
  }
}
