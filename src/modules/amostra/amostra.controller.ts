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
import { AmostraService } from './amostra.service';
import { UpdateAmostraDto } from './dto/update-amostra.dto';
import { CreateAmostraDto } from './dto/create-amostra.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('amostra')
export class AmostraController {
  constructor(private readonly amostraService: AmostraService) {}
  @Get()
  findAll() {
    return this.amostraService.findAll();
  }

  @Roles(Role.ADMIN, Role.OPERADOR)
  @Post()
  create(@Body() dto: CreateAmostraDto) {
    return this.amostraService.create(dto);
  }

  @Roles(Role.ADMIN, Role.OPERADOR)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAmostraDto) {
    return this.amostraService.update(id, dto);
  }

  @Roles(Role.ADMIN, Role.OPERADOR)
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.amostraService.delete(id);
  }
}
