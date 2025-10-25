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
import { ParametrosAnaliseService } from './parametro-analise.service';
import { ParametrosAnaliseDto } from './dto/parametro-analise.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ROUTES } from '../../common/constants/routes.constant';

const { PARAMETROS_ANALISES } = ROUTES;

@Roles(Role.ADMIN, Role.OPERADOR)
@Controller(PARAMETROS_ANALISES.BASE)
export class ParametrosAnaliseController {
  constructor(private readonly paramAnaliseService: ParametrosAnaliseService) {}

  @Get(PARAMETROS_ANALISES.GET.FIND_ALL)
  findAll() {
    return this.paramAnaliseService.findAll();
  }
  @Post(PARAMETROS_ANALISES.POST.CREATE)
  create(@Body() dto: ParametrosAnaliseDto) {
    return this.paramAnaliseService.create(dto);
  }

  @Patch(PARAMETROS_ANALISES.PATCH.UPDATE)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ParametrosAnaliseDto,
  ) {
    return this.paramAnaliseService.update(id, dto);
  }

  @Delete(PARAMETROS_ANALISES.DELETE.DELETE)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.paramAnaliseService.delete(id);
  }
}
