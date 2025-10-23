import { ElementoQuimicoModule } from '../modules/laboratorios-externos/elemento-quimico/elemento-quimico.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from 'src/modules/users/user.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { AmostraModule } from '../modules/amostras/amostra.module';
import { TipoAnaliseModule } from 'src/modules/tipos-de-analises/tipo-analise.module';
import { MateriaPrimaModule } from 'src/modules/materias-primas/materia-prima.module';
import { ParametrosAnaliseModule } from 'src/modules/parametros-analises/parametro-analise.module';
import { ConfiguracaoAnaliseModule } from 'src/modules/configuracoes-analises/configuracao-analise.module';
import { OrdemServicoModule } from 'src/modules/ordens-de-servico/ordem-servico.module';
import { LaboratorioModule } from 'src/modules/laboratorios-externos/laboratorio/laboratorio.module';
import { RemessaLabExternoModule } from 'src/modules/laboratorios-externos/remessa/remessa-lab-externo.module';
import { AmostraLabExternoModule } from 'src/modules/laboratorios-externos/amostra-lab-externo/amostra-lab-externo.module';
import { MailModule } from 'src/mail/mail.module';
import { NotificationsModule } from 'src/modules/notificacoes/notifications.module';
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
