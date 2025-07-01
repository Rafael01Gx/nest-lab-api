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

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    AuthModule,
    AmostraModule,
    TipoAnaliseModule,
    MateriaPrimaModule,
    ParametrosAnaliseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
