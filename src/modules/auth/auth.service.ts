import { UserRepository } from './../user/user.repository';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { SignInDto } from './dto/signin.dto';
import { HashingServiceProtocol } from './hash/hashing.service';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import jwtConfig from './config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingServiceProtocol,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService,
    private userRepository: UserRepository,
  ) {}

  async signIn(user: SignInDto) {
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
    const token = await this.generateToken(userExists as User);

    return { access_token: token };
  }

  async signUp(user: SignUpDto) {
    const userExist = await this.userRepository.findByEmail(user.email);
    if (userExist) {
      throw new HttpException('Email já está em uso', HttpStatus.CONFLICT);
    }

    user.password = await this.hashingService.hash(user.password);
    await this.userRepository.create(user);
    return { message: 'User created successfully' };
  }

  private async generateToken(user: User) {
    return this.jwtService.signAsync(
      {
        sub: user.id,
        name: user.name,
        email: user.email,
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
}
