import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TipoAnaliseService } from './tipo-analise.service';
import { TipoAnaliseDto } from './dto/tipo-analise.dto';
@Controller('tipo-de-analise')
export class TipoAnaliseController {
  constructor(private readonly tipoAnaliseService: TipoAnaliseService) {}

  @Get()
  findAll() {
    return this.tipoAnaliseService.findAll();
  }
  @Post()
  create(@Body() dto: TipoAnaliseDto) {
    return this.tipoAnaliseService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: TipoAnaliseDto) {
    return this.tipoAnaliseService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.tipoAnaliseService.delete(id);
  }
}
