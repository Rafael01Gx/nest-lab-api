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
import { ParametrosAnaliseService } from './parametro-analise.service';
import { ParametrosAnaliseDto } from './dto/parametro-analise.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Roles(Role.ADMIN, Role.OPERADOR)
@Controller('parametros-analises')
export class ParametrosAnaliseController {
  constructor(private readonly paramAnaliseService: ParametrosAnaliseService) {}

  @Get()
  findAll() {
    return this.paramAnaliseService.findAll();
  }
  @Post()
  create(@Body() dto: ParametrosAnaliseDto) {
    return this.paramAnaliseService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ParametrosAnaliseDto,
  ) {
    return this.paramAnaliseService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.paramAnaliseService.delete(id);
  }
}
