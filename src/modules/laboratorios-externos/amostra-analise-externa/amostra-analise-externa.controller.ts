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
import { AmostraLabExternoService } from './amostra-lab-externo.service';
import { CreateAmostraLabExternoDto } from './dto/create-amostra-lab-externo.dto';
import { UpdateAmostraLabExternoDto } from './dto/update-amostra-lab-externo.dto';
import { ROUTES } from '../../../common/constants/routes.constant';

const { AMOSTRAS_LAB_EXTERNO } = ROUTES;

@Roles(Role.ADMIN, Role.OPERADOR)
@Controller(AMOSTRAS_LAB_EXTERNO.BASE)
export class AmostraLabExternoController {
  constructor(
    private readonly amostraLabExternoService: AmostraLabExternoService,
  ) {}

  @Get(AMOSTRAS_LAB_EXTERNO.GET.FIND_ALL)
  findAll() {
    return this.amostraLabExternoService.findAll();
  }

  @Post(AMOSTRAS_LAB_EXTERNO.POST.CREATE)
  create(@Body() dto: CreateAmostraLabExternoDto) {
    return this.amostraLabExternoService.create(dto);
  }

  @Patch(AMOSTRAS_LAB_EXTERNO.PATCH.UPDATE)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAmostraLabExternoDto,
  ) {
    return this.amostraLabExternoService.update(id, dto);
  }

  @Delete(AMOSTRAS_LAB_EXTERNO.DELETE.DELETE)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.amostraLabExternoService.delete(id);
  }
}
