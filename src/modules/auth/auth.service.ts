import { UserRepository } from '../users/repositories/user.repository';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { SignInDto } from './dto/signin.dto';
import { HashingServiceProtocol } from './hash/hashing.service';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import jwtConfig from './config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { User } from '@prisma/client';
import { Response } from 'express';
import { MailService } from 'src/mail/mail.service';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingServiceProtocol,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) { }

  async signIn(user: SignInDto, res: Response) {
    const userExists = await this.userRepository.findByEmail(user.email);
    if (!userExists) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (
      !(await this.hashingService.compare(user.password, userExists.password))
    ) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (userExists.authorization !== true) {
      throw new HttpException('Unauthorized', HttpStatus.FORBIDDEN);
    }

    await this.setCookie(userExists, res);

    const resUser = {
      id: userExists.id,
      name: userExists.name,
      email: userExists.email,
      authorization: userExists.authorization,
      role: userExists.role,
      phone: userExists.phone,
      area: userExists.area,
      funcao: userExists.funcao,
      receives_email: userExists.receives_email,
    };

    return { user: resUser };
  }

  async signUp(user: SignUpDto) {
    const userExist = await this.userRepository.findByEmail(user.email);
    if (userExist) {
      throw new HttpException('Email já está em uso', HttpStatus.CONFLICT);
    }
    const pass = user.password;
    user.password = await this.hashingService.hash(user.password);
    await this.userRepository.create(user).then((res) => {
      if (res) {
        void this.mailService.sendUserAccessEmail({ ...user, password: pass });
      }
    });
    return { message: 'Usuário criado com sucesso!' };
  }

  async forgotPassword(email: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date();
    expires.setHours(expires.getHours() + 1);

    await this.userRepository.updateResetToken(email, token, expires);

    const baseUrl = this.configService.get<string>('WEB_APPLICATION_BASE_URL') ?? 'http://web.rflgx.com.br';
    await this.mailService.sendPasswordResetEmail(
      user.email,
      user.name,
      token,
      baseUrl,
    );

    return { message: 'E-mail de recuperação enviado com sucesso!' };
  }

  async resetPassword(email: string, password: string, token: string) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }

    if (!user.passwordResetToken || user.passwordResetToken !== token) {
      throw new HttpException('Token inválido', HttpStatus.BAD_REQUEST);
    }

    if (!user.passwordResetExpires || user.passwordResetExpires < new Date()) {
      throw new HttpException('Token expirado', HttpStatus.BAD_REQUEST);
    }


    const hashedPassword = await this.hashingService.hash(password);
    await this.userRepository.updatePassword(email, hashedPassword);

    return { message: 'Senha alterada com sucesso!' };
  }

  private async generateToken(user: User) {
    return this.jwtService.signAsync(
      {
        sub: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        area: user.area,
        funcao: user.funcao,
        receives_email: user.receives_email,
        authorization: user.authorization,
        role: user.role,
      },
      {
        secret: this.jwtConfiguration.secret,
        expiresIn: this.jwtConfiguration.jwtTl as any,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
      },
    );
  }

  private async setCookie(user: User, res: Response) {
    const token = await this.generateToken(user);

    return res.cookie('access_token', token, {
      httpOnly: true,
      secure: false, //HTTPS
      maxAge: 1000 * 60 * 60 * 24,
      sameSite: 'lax',
      path: '/',
    });
  }


}
