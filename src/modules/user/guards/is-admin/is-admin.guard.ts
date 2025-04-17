import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { User } from '../../entities/user.entity';

@Injectable()
export class IsAdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const user: User = request['user'];

    if (!user) {
      return false;
    }
    if (user.level !== 'admin' && user.authorization !== true) {
      return false;
    }
    return true;
  }
}
