import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query, UseInterceptors,
} from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { AmostraAnaliseExternaService } from './amostra-analise-externa.service';
import { ROUTES } from '../../../common/constants/routes.constant';
import { UpdateAmostraAnaliseExternaDto } from './dto/update-amostra-analise-externa.dto';
import { AmostraAnaliseExternaQueryDto } from './dto/amostra-analise-externa-query.dto';
import { CacheInterceptor } from '../../../common/interceptors/cache.interceptor';

const { AMOSTRAS_ANALISE_EXTERNA } = ROUTES;

@Roles(Role.ADMIN, Role.OPERADOR)
@Controller(AMOSTRAS_ANALISE_EXTERNA.BASE)
export class AmostraAnaliseExternaController {
  constructor(
    private readonly amostraLabExternoService: AmostraAnaliseExternaService,
  ) {}

  @Get(AMOSTRAS_ANALISE_EXTERNA.GET.FIND_ALL)
  findAll(@Query() query: AmostraAnaliseExternaQueryDto) {
    return this.amostraLabExternoService.findAll(query);
  }


  @UseInterceptors(CacheInterceptor)
  @Get(AMOSTRAS_ANALISE_EXTERNA.GET.DASHBOARD_COMPLETO)
  async getDashboardCompleto(
    @Query('laboratorioId', new ParseIntPipe({ optional: true })) laboratorioId?: number,
    @Query('dataInicio') dataInicio?: string,
    @Query('dataFim') dataFim?: string,
  ) {
    const filtros = {
      laboratorioId,
      dataInicio,
      dataFim,
    };
    return this.amostraLabExternoService.getDashboardCompleto(filtros);
  }

  @Patch(AMOSTRAS_ANALISE_EXTERNA.PATCH.UPDATE)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAmostraAnaliseExternaDto,
  ) {
    return this.amostraLabExternoService.update(id, dto);
  }


}
