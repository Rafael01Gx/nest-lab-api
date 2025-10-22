import { ElementoQuimicoModule } from './../modules/laboratorios-externos/elemento-quimico/elemento-quimico.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from 'src/modules/user/user.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { AmostraModule } from '../modules/amostra/amostra.module';
import { TipoAnaliseModule } from 'src/modules/tipo-de-analise/tipo-analise.module';
import { MateriaPrimaModule } from 'src/modules/materia-prima/materia-prima.module';
import { ParametrosAnaliseModule } from 'src/modules/parametro-analise/parametro-analise.module';
import { ConfiguracaoAnaliseModule } from 'src/modules/configuraçao-analise/configuracao-analise.module';
import { OrdemServicoModule } from 'src/modules/ordem-servico/ordem-servico.module';
import { LaboratorioModule } from 'src/modules/laboratorios-externos/laboratorio/laboratorio.module';
import { RemessaLabExternoModule } from 'src/modules/laboratorios-externos/remessa/remessa-lab-externo.module';
import { AmostraLabExternoModule } from 'src/modules/laboratorios-externos/amostra-lab-externo/amostra-lab-externo.module';
import { MailModule } from 'src/mail/mail.module';
import { NotificationsModule } from 'src/modules/notifications/notifications.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    UserModule,
    AuthModule,
    AmostraModule,
    TipoAnaliseModule,
    MateriaPrimaModule,
    ParametrosAnaliseModule,
    ConfiguracaoAnaliseModule,
    OrdemServicoModule,
    ElementoQuimicoModule,
    LaboratorioModule,
    RemessaLabExternoModule,
    AmostraLabExternoModule,
    MailModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
