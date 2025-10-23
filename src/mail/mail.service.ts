import { Inject, Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Transporter, SendMailOptions } from 'nodemailer';
import { ConfigType } from '@nestjs/config';
import mailConfig from './config/mail.config';
import { ISendMail } from './interfaces/ISendMail';
import { accessEmailTemplate } from './templates/access-email.template';
import { newOrderTemplate } from './templates/new-order.template';
import { IOrdemServico } from 'src/modules/ordens-de-servico/interfaces/ordem-servico.interface';
import { SignUpDto } from 'src/modules/auth/dto/signup.dto';
import { ordemConcluidaTemplate } from './templates/ordem-concluida.template.ts';

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

  private async sendMail(
    to: string,
    subject: string,
    html: string,
  ): Promise<void> {
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

  private async sendMailWithHtml<T>(options: ISendMail<T>): Promise<void> {
    const { to, subject, data, htmlFunction } = options;
    const html = htmlFunction(data);
    await this.sendMail(to, subject, html);
    return;
  }

  async sendNewOrderEmail(
    destinatarios: string,
    ordem: IOrdemServico,
  ): Promise<void> {
    try {
      await this.sendMailWithHtml({
        to: destinatarios,
        subject: 'Nova Ordem de Serviço Gerada',
        data: ordem,
        htmlFunction: newOrderTemplate,
      });
    } catch (err) {
      console.log(err);
      return;
    }
  }

  async sendUserAccessEmail(user: SignUpDto): Promise<void> {
    try {
      await this.sendMailWithHtml({
        to: user.email,
        subject: 'Acesso liberado ao sistema LabFísico',
        data: user,
        htmlFunction: accessEmailTemplate,
      });
    } catch (err) {
      console.log(err);
      return;
    }
  }

  async sendOrdemConcluidaEmail(ordem: IOrdemServico): Promise<void> {
    try {
      await this.sendMailWithHtml({
        to: ordem.solicitante.email,
        subject: 'Sua Ordem de Serviço foi concluída - LabFísico',
        data: ordem,
        htmlFunction: ordemConcluidaTemplate,
      });
    } catch (err) {
      console.log(err);
      return;
    }
  }
}
