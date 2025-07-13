import { UserRepository } from './../user/repositories/user.repository';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { SignInDto } from './dto/signin.dto';
import { HashingServiceProtocol } from './hash/hashing.service';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import jwtConfig from './config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { User } from '@prisma/client';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingServiceProtocol,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService,
    private userRepository: UserRepository,
  ) {}

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
    };

    return { user: resUser };
  }

  async signUp(user: SignUpDto) {
    const userExist = await this.userRepository.findByEmail(user.email);
    if (userExist) {
      throw new HttpException('Email já está em uso', HttpStatus.CONFLICT);
    }

    user.password = await this.hashingService.hash(user.password);
    await this.userRepository.create(user);
    return { message: 'Usuário criado com sucesso!' };
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
        authorization: user.authorization,
        role: user.role,
      },
      {
        secret: this.jwtConfiguration.secret,
        expiresIn: this.jwtConfiguration.jwtTl,
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
