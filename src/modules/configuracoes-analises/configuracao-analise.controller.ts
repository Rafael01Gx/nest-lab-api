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
import { ConfiguracaoAnaliseService } from './configuracao-analise.service';
import { CreateConfigAnaliseDto } from './dto/create-config-analise.dto';
import { UpdateConfigAnaliseDto } from './dto/update-config-analise.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ROUTES } from '../../common/constants/routes.constant';

const { CONFIG_ANALISES } = ROUTES;

@Roles(Role.ADMIN, Role.OPERADOR)
@Controller(CONFIG_ANALISES.BASE)
export class ConfiguracaoAnaliseController {
  constructor(
    private readonly configuracaoAnaliseService: ConfiguracaoAnaliseService,
  ) {}

  @Get(CONFIG_ANALISES.GET.FIND_ALL)
  findAll() {
    return this.configuracaoAnaliseService.findAll();
  }
  @Get(CONFIG_ANALISES.GET.FIND_BY_TIPO_ANALISE_ID)
  findByTipoAnaliseId(@Param('id', ParseIntPipe) id: number) {
    return this.configuracaoAnaliseService.findByTipoAnaliseId(id);
  }

  @Post(CONFIG_ANALISES.POST.CREATE)
  create(@Body() dto: CreateConfigAnaliseDto) {
    return this.configuracaoAnaliseService.create(dto);
  }

  @Patch(CONFIG_ANALISES.PATCH.UPDATE)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateConfigAnaliseDto,
  ) {
    return this.configuracaoAnaliseService.update(id, dto);
  }

  @Delete(CONFIG_ANALISES.DELETE.DELETE)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.configuracaoAnaliseService.delete(id);
  }
}
