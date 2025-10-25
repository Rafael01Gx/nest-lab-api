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
import { ROUTES } from '../../../common/constants/routes.constant';

const{ LABORATORIO_EXTERNO } = ROUTES;

@Roles(Role.ADMIN, Role.OPERADOR)
@Controller(LABORATORIO_EXTERNO.BASE)
export class LaboratorioController {
  constructor(private readonly laboratorioService: LaboratorioService) {}

  @Get(LABORATORIO_EXTERNO.GET.FIND_ALL)
  findAll() {
    return this.laboratorioService.findAll();
  }

  @Post(LABORATORIO_EXTERNO.POST.CREATE)
  create(@Body() dto: CreateLaboratorioDto) {
    return this.laboratorioService.create(dto);
  }

  @Patch(LABORATORIO_EXTERNO.PATCH.UPDATE)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateLaboratorioDto,
  ) {
    return this.laboratorioService.update(id, dto);
  }

  @Delete(LABORATORIO_EXTERNO.DELETE.DELETE)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.laboratorioService.delete(id);
  }
}
