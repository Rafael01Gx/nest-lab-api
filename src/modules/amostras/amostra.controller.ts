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
import { AmostraService } from './amostra.service';
import { UpdateAmostraDto } from './dto/update-amostra.dto';
import { CreateAmostraDto } from './dto/create-amostra.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { AmostraQueryDto } from './dto/amostra-servico-query.dto';
import { AgendaQueryDto } from './dto/agenda-query.dto';
import { ROUTES } from '../../common/constants/routes.constant';

const {AMOSTRAS} = ROUTES;

@Controller(AMOSTRAS.BASE)
export class AmostraController {
  constructor(private readonly amostraService: AmostraService) {}

  @Roles(Role.ADMIN, Role.OPERADOR)
  @Get(AMOSTRAS.GET.FIND_ALL)
  findAll(@Query() query: AmostraQueryDto) {
    return this.amostraService.findAll(query);
  }

  @Roles(Role.ADMIN, Role.OPERADOR, Role.USUARIO)
  @Get(AMOSTRAS.GET.FIND_ALL_WITH_USERS)
  findAllWithUsers(@Query() query: AmostraQueryDto, @CurrentUser() user: User) {
    return this.amostraService.findAllWithUsers(query, user);
  }

  @Roles(Role.ADMIN, Role.OPERADOR)
  @Get(AMOSTRAS.GET.FIND_ALL_WITH_USERS_ADMIN)
  findAllWithUsersAdmin(@Query() query: AmostraQueryDto) {
    return this.amostraService.findAllWithUsersAdmin(query);
  }

  @Get(AMOSTRAS.GET.FIND_ALL_BY_USER)
  findAllByUser(@CurrentUser() user: User) {
    return this.amostraService.findAllByUser(user);
  }

  @Roles(Role.ADMIN)
  @Get(AMOSTRAS.GET.GET_AGENDAMENTO_SEMANAL)
  getAgendamentoSemanal(@Query() query: AgendaQueryDto) {
    return this.amostraService.getAgendamentoSemanal(query);
  }

  @Roles(Role.ADMIN)
  @Get(AMOSTRAS.GET.GET_ESTATISTICAS)
  async getEstatisticas() {
    return this.amostraService.getEstatisticas();
  }

  @Get(AMOSTRAS.GET.FIND_ALL_WITH_USERS_BY_OS)
  findAllWithUsersByOs(
    @Param('numeroOs') numeroOs: string,
    @CurrentUser() user: User,
  ) {
    return this.amostraService.findAllWithUsersByOs(numeroOs, user);
  }

  @Roles(Role.ADMIN)
  @Get(AMOSTRAS.GET.DETALHES_AMOSTRA)
  async detalhesAmostra(@Param('id', ParseIntPipe) id: number) {
    return this.amostraService.detalhesAmostra(id);
  }

  @Roles(Role.ADMIN, Role.OPERADOR)
  @Get(AMOSTRAS.GET.FIND_BY_ID)
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.amostraService.findById(id);
  }

  @Roles(Role.ADMIN, Role.OPERADOR)
  @Post(AMOSTRAS.POST.CREATE)
  create(@Body() dto: CreateAmostraDto) {
    return this.amostraService.create(dto);
  }

  @Roles(Role.ADMIN)
  @Patch(AMOSTRAS.PATCH.ASSINAR)
  assinar(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: User) {
    return this.amostraService.assinar(id, user);
  }

  @Roles(Role.ADMIN, Role.OPERADOR)
  @Patch(AMOSTRAS.PATCH.UPDATE)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAmostraDto,
    @CurrentUser() user: User,
  ) {
    return this.amostraService.update(id, dto, user);
  }

  @Roles(Role.ADMIN, Role.OPERADOR)
  @Delete(AMOSTRAS.DELETE.DELETE)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.amostraService.delete(id);
  }
}
