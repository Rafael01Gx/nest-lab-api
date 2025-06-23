import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from 'src/modules/user/user.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { AmostraModule } from './modules/amostra/amostra.module';

@Module({
  imports: [ConfigModule.forRoot(), UserModule, AuthModule, AmostraModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
