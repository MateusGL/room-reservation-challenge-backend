import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { UserEntity } from 'src/users/user.entity';

export const GetUser = createParamDecorator(
  (data: keyof UserEntity | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.user as UserEntity;

    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    return data ? user?.[data] : user;
  },
);
