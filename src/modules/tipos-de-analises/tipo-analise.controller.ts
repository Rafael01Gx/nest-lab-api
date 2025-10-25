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
import { TipoAnaliseService } from './tipo-analise.service';
import { TipoAnaliseDto } from './dto/tipo-analise.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ROUTES } from '../../common/constants/routes.constant';

const { TIPOS_DE_ANALISES } = ROUTES;

@Controller(TIPOS_DE_ANALISES.BASE)
export class TipoAnaliseController {
  constructor(private readonly tipoAnaliseService: TipoAnaliseService) {}

  @Get(TIPOS_DE_ANALISES.GET.FIND_ALL)
  findAll() {
    return this.tipoAnaliseService.findAll();
  }

  @Roles(Role.ADMIN, Role.OPERADOR)
  @Post(TIPOS_DE_ANALISES.POST.CREATE)
  create(@Body() dto: TipoAnaliseDto) {
    return this.tipoAnaliseService.create(dto);
  }

  @Roles(Role.ADMIN, Role.OPERADOR)
  @Patch(TIPOS_DE_ANALISES.PATCH.UPDATE)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: TipoAnaliseDto) {
    return this.tipoAnaliseService.update(id, dto);
  }

  @Roles(Role.ADMIN, Role.OPERADOR)
  @Delete(TIPOS_DE_ANALISES.DELETE.DELETE)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.tipoAnaliseService.delete(id);
  }
}
