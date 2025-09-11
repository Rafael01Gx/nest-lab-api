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
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from '../user/entities/user.entity';

@Controller('amostra')
export class AmostraController {
  constructor(private readonly amostraService: AmostraService) {}

  @Roles(Role.ADMIN, Role.OPERADOR)
  @Get()
  findAll() {
    return this.amostraService.findAll();
  }
  @Get('user')
  findAllByUser(@CurrentUser() user: User) {
    return this.amostraService.findAllByUser(user);
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
