import { UserRepository } from './../user/user.repository';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { SignInDto } from './dto/signin.dto';
import { HashingServiceProtocol } from './hash/hashing.service';
import jwtConfig from './config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';

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
        HttpStatus.NOT_FOUND,
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
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    const token = await this.jwtService.signAsync(
      {
        sub: userExists.id,
        name: userExists.name,
        email: userExists.email,
      },
      {
        secret: this.jwtConfiguration.secret,
        expiresIn: this.jwtConfiguration.jwtTl,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
      },
    );

    return token;
  }
  async signUp(user: SignUpDto) {
    const userExist = await this.userRepository.findByEmail(user.email);
    if (userExist) {
      throw new HttpException('Email já está em uso', HttpStatus.CONFLICT);
    }
    user.password = await this.hashingService.hash(user.password);
    console.log('ok');
    return await this.userRepository.create(user);
  }
}
