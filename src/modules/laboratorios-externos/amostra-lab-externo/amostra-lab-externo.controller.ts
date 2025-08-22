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

@Roles(Role.ADMIN, Role.OPERADOR)
@Controller('amostra-lab-externo')
export class AmostraLabExternoController {
  constructor(
    private readonly amostraLabExternoService: AmostraLabExternoService,
  ) {}

  @Get()
  findAll() {
    return this.amostraLabExternoService.findAll();
  }

  @Post()
  create(@Body() dto: CreateAmostraLabExternoDto) {
    return this.amostraLabExternoService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAmostraLabExternoDto,
  ) {
    return this.amostraLabExternoService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.amostraLabExternoService.delete(id);
  }
}
