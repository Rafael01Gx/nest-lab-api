import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { OrdemServicoService } from './ordem-servico.service';
import { CreateOrdemServicoDto } from './dto/ordem-servico.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { UpdateOrdemServicoDto } from './dto/update-ordem-servico.dto';
import { OrdemServicoQueryDto } from './dto/ordem-servico-query.dto';
import { OrdemServicoAgendamentoDto } from './dto/ordem-servico-agendamento.dto';
import { ROUTES } from '../../common/constants/routes.constant';

const { ORDENS_DE_SERVICO } = ROUTES;

@Controller(ORDENS_DE_SERVICO.BASE)
export class OrdemServicoController {
  constructor(private readonly ordemServicoService: OrdemServicoService) { }

  @Roles(Role.ADMIN, Role.USUARIO)
  @Post(ORDENS_DE_SERVICO.POST.CREATE)
  create(@Body() dto: CreateOrdemServicoDto, @CurrentUser() user: User) {
    return this.ordemServicoService.create(dto, user);
  }

  @Roles(Role.ADMIN, Role.OPERADOR)
  @Get(ORDENS_DE_SERVICO.GET.FIND_ALL)
  findAll(@Query() query: OrdemServicoQueryDto) {
    return this.ordemServicoService.findAll(query);
  }

  @Roles(Role.ADMIN, Role.OPERADOR)
  @Get(ORDENS_DE_SERVICO.GET.FIND_BY_FILTERS)
  findByFilters(@Query() query: OrdemServicoQueryDto) {
    return this.ordemServicoService.findByFilters(query);
  }
  @Get(ORDENS_DE_SERVICO.GET.FIND_BY_USER_AND_FILTERS)
  findByUserAndFilters(@Query() query: OrdemServicoQueryDto, @CurrentUser() user: User) {
    return this.ordemServicoService.findByUserAndFilters(user, query);
  }

  @Get(ORDENS_DE_SERVICO.GET.FIND_ALL_BY_USER)
  findAllByUser(
    @CurrentUser() user: User,
    @Query() query: OrdemServicoQueryDto,
  ) {
    return this.ordemServicoService.findAllByUser(user, query);
  }

  @Get(ORDENS_DE_SERVICO.GET.GET_ESTATISTICAS)
  getEstatisticas() {
    return this.ordemServicoService.getEstatisticas();
  }
  //--------------------------------
  @Roles(Role.ADMIN, Role.OPERADOR)
  @Patch(ORDENS_DE_SERVICO.PATCH.AGENDAR)
  agendar(@Param('id') id: string, @Body() dto: OrdemServicoAgendamentoDto) {
    return this.ordemServicoService.agendarPreparacao(id, dto);
  }

  //--------------------------------
  @Roles(Role.ADMIN)
  @Patch(ORDENS_DE_SERVICO.PATCH.UPDATE)
  update(@Param('id') id: string, @Body() dto: UpdateOrdemServicoDto) {
    return this.ordemServicoService.updateStatus(id, dto);
  }

  @Delete(ORDENS_DE_SERVICO.DELETE.DELETE)
  delete(@Param('id', ParseIntPipe) id: number) {
    return id;
  }
}
