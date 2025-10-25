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
import { MateriaPrimaService } from './materia-prima.service';
import { MateriaPrimaDto } from './dto/materia-prima.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ROUTES } from '../../common/constants/routes.constant';

const { MATERIAS_PRIMAS } = ROUTES ;

@Roles(Role.ADMIN, Role.OPERADOR)
@Controller(MATERIAS_PRIMAS.BASE)
export class MateriaPrimaController {
  constructor(private readonly materiaPrimaService: MateriaPrimaService) {}

  @Get(MATERIAS_PRIMAS.GET.FIND_ALL)
  findAll() {
    return this.materiaPrimaService.findAll();
  }
  @Post(MATERIAS_PRIMAS.POST.CREATE)
  create(@Body() dto: MateriaPrimaDto) {
    return this.materiaPrimaService.create(dto);
  }

  @Patch(MATERIAS_PRIMAS.PATCH.UPDATE)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: MateriaPrimaDto) {
    return this.materiaPrimaService.update(id, dto);
  }

  @Delete(MATERIAS_PRIMAS.DELETE.DELETE)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.materiaPrimaService.delete(id);
  }
}
