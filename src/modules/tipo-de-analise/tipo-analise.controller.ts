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
import { TipoAnaliseService } from './tipo-analise.service';
import { TipoAnaliseDto } from './dto/tipo-analise.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
@Controller('tipo-de-analise')
export class TipoAnaliseController {
  constructor(private readonly tipoAnaliseService: TipoAnaliseService) {}

  @Get()
  findAll() {
    return this.tipoAnaliseService.findAll();
  }

  @Roles(Role.ADMIN, Role.OPERADOR)
  @Post()
  create(@Body() dto: TipoAnaliseDto) {
    return this.tipoAnaliseService.create(dto);
  }

  @Roles(Role.ADMIN, Role.OPERADOR)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: TipoAnaliseDto) {
    return this.tipoAnaliseService.update(id, dto);
  }

  @Roles(Role.ADMIN, Role.OPERADOR)
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.tipoAnaliseService.delete(id);
  }
}
