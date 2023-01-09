import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { verify } from 'jsonwebtoken';
import { Observable } from 'rxjs';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const { req } = GqlExecutionContext.create(context).getContext()
    const { authorization: authHeader } = req.headers

    if (!authHeader || !authHeader.startsWith('Bearer ')) return false

    const token = authHeader.split(' ')[1]

    try {
      const decoded = verify(token, process.env.JWT_SECRET)
      req.user = decoded
      return true
    } catch (err) {
        return false
    }
  }
}
