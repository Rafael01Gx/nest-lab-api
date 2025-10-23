import { forwardRef, Module } from '@nestjs/common';
import { AmostraService } from './amostra.service';
import { AmostraRepository } from './repositories/amostra.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AmostraController } from './amostra.controller';
import { OrdemServicoModule } from '../ordens-de-servico/ordem-servico.module';
import { MailModule } from 'src/mail/mail.module';
import { NotificationsModule } from '../notificacoes/notifications.module';

@Module({
  providers: [AmostraService, AmostraRepository],
  controllers: [AmostraController],
  imports: [PrismaModule, forwardRef(()=> OrdemServicoModule),MailModule,NotificationsModule],
  exports: [AmostraRepository],
})
export class AmostraModule {}
