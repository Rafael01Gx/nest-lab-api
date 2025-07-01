import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ParametrosAnaliseService } from './parametro-de-analise.service';
import { ParametrosAnaliseDto } from './dto/parametro-de-analise.dto';

@Controller('parametro-analise')
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
  update(@Param('id') id: string, @Body() dto: ParametrosAnaliseDto) {
    return this.paramAnaliseService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.paramAnaliseService.delete(id);
  }
}
