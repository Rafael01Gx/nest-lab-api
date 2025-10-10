import { Inject, Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Transporter, SendMailOptions } from 'nodemailer';
import { ConfigType } from '@nestjs/config';
import mailConfig from './config/mail.config';
import { ISendMail } from './interfaces/ISendMail';

@Injectable()
export class MailService {
  private readonly transporter: Transporter;
  private readonly logger = new Logger(MailService.name);

  constructor(
    @Inject(mailConfig.KEY)
    private readonly config: ConfigType<typeof mailConfig>,
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.config.host,
      port: this.config.port,
      secure: this.config.port === 465,
      auth: {
        user: this.config.user,
        pass: this.config.pass,
      },
    });
  }

  async sendMail(to: string, subject: string, html: string): Promise<void> {
    const mailOptions: SendMailOptions = {
      from: this.config.from,
      to,
      subject,
      html,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(
          `Erro ao enviar e-mail: ${error.message}`,
          error.stack,
        );
      } else {
        this.logger.error('Erro desconhecido ao enviar e-mail');
      }
    }
  }

  async sendMailWithHtml<T>(options: ISendMail<T>): Promise<void> {
    const { to, subject, data, htmlFunction } = options;
    const html = htmlFunction(data);
    await this.sendMail(to, subject, html);
    return;
  }
}
