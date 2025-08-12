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
import { OrdemServicoService } from './ordem-servico.service';
import { CreateOrdemServicoDto } from './dto/ordem-servico.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from '../user/entities/user.entity';

@Controller('ordem-servico')
export class OrdemServicoController {
  constructor(private readonly ordemServicoService: OrdemServicoService) {}

  @Post()
  create(@Body() dto: CreateOrdemServicoDto, @CurrentUser() user: User) {
    return this.ordemServicoService.create(dto, user);
  }
  /*
  @Get()
  findAll() {
    return this.ordemServicoService.findAll();
  }


  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrdemServicoDto,
  ) {
    return this.configuracaoAnaliseService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.configuracaoAnaliseService.delete(id);
  }
    */
}
