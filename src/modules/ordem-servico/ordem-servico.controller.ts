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
import { User } from '../user/entities/user.entity';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { UpdateOrdemServicoDto } from './dto/update-ordem-servico.dto';
import { OrdemServicoQueryDto } from './dto/ordem-servico-query.dto';

@Controller('ordem-servico')
export class OrdemServicoController {
  constructor(private readonly ordemServicoService: OrdemServicoService) {}

  @Post()
  create(@Body() dto: CreateOrdemServicoDto, @CurrentUser() user: User) {
    return this.ordemServicoService.create(dto, user);
  }

  @Roles(Role.ADMIN, Role.OPERADOR)
  @Get()
  findAll() {
    return this.ordemServicoService.findAll();
  }

  @Get('user')
  findAllByUser(
    @CurrentUser() user: User,
    @Query() query: OrdemServicoQueryDto,
  ) {
    return this.ordemServicoService.findAllByUser(user, query);
  }

  @Get('estatisticas')
  getEstatisticas() {
    return this.ordemServicoService.getEstatisticas();
  }
  //--------------------------------
  @Roles(Role.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateOrdemServicoDto) {
    return this.ordemServicoService.updateStatus(id, dto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return id;
  }
}
