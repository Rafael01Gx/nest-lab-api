import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { TipoDeAnaliseService } from './tipo-de-analise.service';
import { TipoDeAnaliseDto } from './dto/tipo-de-analise.dto';
@Public() //Remover
@Controller('tipo-de-analise')
export class TipoDeAnaliseController {
  constructor(private readonly tipoAnaliseService: TipoDeAnaliseService) {}

  @Get()
  findAll() {
    return this.tipoAnaliseService.findAll();
  }
  @Post()
  create(@Body() dto: TipoDeAnaliseDto) {
    return this.tipoAnaliseService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: TipoDeAnaliseDto) {
    return this.tipoAnaliseService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.tipoAnaliseService.delete(id);
  }
}
