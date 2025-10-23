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
import { ROUTES } from '../../../common/constants/routes.constant';

const { ELEMENTO_QUIMICO } = ROUTES;

@Roles(Role.ADMIN, Role.OPERADOR)
@Controller(ELEMENTO_QUIMICO.BASE)
export class ElementoQuimicoController {
  constructor(
    private readonly elementoQuimicoService: ElementoQuimicoService,
  ) {}

  @Get(ELEMENTO_QUIMICO.GET.FIND_ALL)
  findAll() {
    return this.elementoQuimicoService.findAll();
  }

  @Post(ELEMENTO_QUIMICO.POST.CREATE)
  create(@Body() dto: CreateElementoQuimicoDto) {
    return this.elementoQuimicoService.create(dto);
  }

  @Patch(ELEMENTO_QUIMICO.PATCH.UPDATE)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateElementoQuimicoDto,
  ) {
    return this.elementoQuimicoService.update(id, dto);
  }

  @Delete(ELEMENTO_QUIMICO.DELETE.DELETE)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.elementoQuimicoService.delete(id);
  }
}
