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

@Roles(Role.ADMIN, Role.OPERADOR)
@Controller('config-analise')
export class ConfiguracaoAnaliseController {
  constructor(
    private readonly configuracaoAnaliseService: ConfiguracaoAnaliseService,
  ) {}

  @Get()
  findAll() {
    return this.configuracaoAnaliseService.findAll();
  }
  @Get('analise/:id')
  findByTipoAnaliseId(@Param('id', ParseIntPipe) id: number) {
    return this.configuracaoAnaliseService.findByTipoAnaliseId(id);
  }

  @Post()
  create(@Body() dto: CreateConfigAnaliseDto) {
    return this.configuracaoAnaliseService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateConfigAnaliseDto,
  ) {
    return this.configuracaoAnaliseService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.configuracaoAnaliseService.delete(id);
  }
}
