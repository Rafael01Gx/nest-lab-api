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
import { ElementoQuimicoService } from './elemento-quimico.service';
import { CreateElementoQuimicoDto } from './dto/create-elemento-quimico.dto';
import { UpdateElementoQuimicoDto } from './dto/update-elemento-quimico.dto';

@Roles(Role.ADMIN, Role.OPERADOR)
@Controller('amostra')
export class ElementoQuimicoController {
  constructor(
    private readonly elementoQuimicoService: ElementoQuimicoService,
  ) {}

  @Get()
  findAll() {
    return this.elementoQuimicoService.findAll();
  }

  @Post()
  create(@Body() dto: CreateElementoQuimicoDto) {
    return this.elementoQuimicoService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateElementoQuimicoDto,
  ) {
    return this.elementoQuimicoService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.elementoQuimicoService.delete(id);
  }
}
