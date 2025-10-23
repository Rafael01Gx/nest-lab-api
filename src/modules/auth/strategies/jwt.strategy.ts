import { UserRepository } from '../../users/repositories/user.repository';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { UserPayload } from '../types/user-payload.type';

interface RequestWithCookies extends Request {
  cookies: Record<string, string>;
}

const cookieExtractor = (req: RequestWithCookies): string | null => {
  return req?.cookies?.['access_token'] ?? null;
};
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly UserRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: jwtConfiguration.secret!,
      issuer: jwtConfiguration.issuer,
      audience: jwtConfiguration.audience,
    });
  }

  async validate(payload: UserPayload) {
    const user = await this.UserRepository.getById(payload.sub);
    if (!user || !user.authorization) {
      throw new UnauthorizedException('Unauthorized');
    }
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      area: user.area,
      funcao: user.funcao,
      authorization: user.authorization,
      role: user.role,
    };
  }
}
