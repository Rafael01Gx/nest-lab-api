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
import { RemessaLabExternoService } from './remessa-lab-externo.service';
import { UpdateRemessaLabExternoDto } from './dto/update-remessa-lab-externo.dto';
import { CreateRemessaLabExternoDto } from './dto/create-remessa-lab-externo.dto';

@Roles(Role.ADMIN, Role.OPERADOR)
@Controller('remessa-lab-externo')
export class RemessaLabExternoController {
  constructor(
    private readonly remessaLabExternoService: RemessaLabExternoService,
  ) {}

  @Get()
  findAll() {
    return this.remessaLabExternoService.findAll();
  }

  @Post()
  create(@Body() dto: CreateRemessaLabExternoDto) {
    return this.remessaLabExternoService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRemessaLabExternoDto,
  ) {
    return this.remessaLabExternoService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.remessaLabExternoService.delete(id);
  }
}
