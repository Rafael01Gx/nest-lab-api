import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { HashingServiceProtocol } from './hash/hashing.service';
import { BcryptService } from './hash/bcrypt.service';
import { UserModule } from '../user/user.module';

@Global()
@Module({
  providers: [
    AuthService,
    { provide: HashingServiceProtocol, useClass: BcryptService },
  ],
  exports: [HashingServiceProtocol],
  controllers: [AuthController],
  imports: [
    PrismaModule,
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    UserModule,
  ],
})
export class AuthModule {}
