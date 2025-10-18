import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { OrdemServicoController } from './ordem-servico.controller';
import { OrdemServicoService } from './ordem-servico.service';
import { OrdemServicoRepository } from './repositories/ordem-servico.repository';
import { UserModule } from '../user/user.module';
import { AmostraModule } from '../amostra/amostra.module';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [PrismaModule, UserModule, forwardRef(()=>AmostraModule), MailModule],
  controllers: [OrdemServicoController],
  providers: [OrdemServicoService, OrdemServicoRepository],
  exports: [OrdemServicoRepository],
})
export class OrdemServicoModule {}
