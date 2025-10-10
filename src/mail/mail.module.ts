import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import mailConfig from './config/mail.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forFeature(mailConfig)],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
