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
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { RemessaLabExternoService } from './remessa-lab-externo.service';
import { UpdateRemessaLabExternoDto } from './dto/update-remessa-lab-externo.dto';
import { CreateRemessaLabExternoDto } from './dto/create-remessa-lab-externo.dto';
import { ROUTES } from '../../../common/constants/routes.constant';
import { QueryDto } from 'src/shared/dto/query.dto';

const { REMESSA_LAB_EXTERNO } = ROUTES;

@Roles(Role.ADMIN, Role.OPERADOR)
@Controller(REMESSA_LAB_EXTERNO.BASE)
export class RemessaLabExternoController {
  constructor(
    private readonly remessaLabExternoService: RemessaLabExternoService,
  ) {}

  @Get(REMESSA_LAB_EXTERNO.GET.FIND_ALL)
  findAll(@Query()query:QueryDto) {
    return this.remessaLabExternoService.findAll(query);
  }

  @Post(REMESSA_LAB_EXTERNO.POST.CREATE)
  create(@Body() dto: CreateRemessaLabExternoDto) {
    return this.remessaLabExternoService.create(dto);
  }

  @Patch(REMESSA_LAB_EXTERNO.PATCH.UPDATE)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRemessaLabExternoDto,
  ) {
    return this.remessaLabExternoService.update(id, dto);
  }

  @Delete(REMESSA_LAB_EXTERNO.DELETE.DELETE)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.remessaLabExternoService.delete(id);
  }
}
