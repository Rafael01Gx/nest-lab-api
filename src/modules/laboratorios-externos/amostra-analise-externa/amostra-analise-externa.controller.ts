import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { AmostraAnaliseExternaService } from './amostra-analise-externa.service';
import { ROUTES } from '../../../common/constants/routes.constant';
import { UpdateAmostraAnaliseExternaDto } from './dto/update-amostra-analise-externa.dto';
import { AmostraAnaliseExternaQueryDto } from './dto/amostra-analise-externa-query.dto';
import { CacheInterceptor } from '../../../common/interceptors/cache.interceptor';
import { UpdateManyDto } from './dto/update-many.dto';

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

  @Get(AMOSTRAS_ANALISE_EXTERNA.GET.FIND_ALL_ALCALIS_ZINCO)
  findAllAlcalisZinco(@Query() query: AmostraAnaliseExternaQueryDto) {
    return this.amostraLabExternoService.findAllAlcalisZinco(query);
  }
  
  @Get(AMOSTRAS_ANALISE_EXTERNA.GET.FIND_ALL_WITH_RESULTS)
  findAllWithResults(@Query() query: AmostraAnaliseExternaQueryDto) {
    return this.amostraLabExternoService.findAllWithResults(query);
  }

  @UseInterceptors(CacheInterceptor)
  @Get(AMOSTRAS_ANALISE_EXTERNA.GET.DASHBOARD_COMPLETO)
  async getDashboardCompleto(
    @Query('laboratorioId', new ParseIntPipe({ optional: true }))
    laboratorioId?: number,
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

  @Patch(AMOSTRAS_ANALISE_EXTERNA.PATCH.UPDATE_MANY)
  updateMany(@Body() dto: UpdateManyDto) {
    return this.amostraLabExternoService.updateMany(dto);
  }

  @Patch(AMOSTRAS_ANALISE_EXTERNA.PATCH.UPDATE)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAmostraAnaliseExternaDto,
  ) {
    return this.amostraLabExternoService.update(id, dto);
  }
}
