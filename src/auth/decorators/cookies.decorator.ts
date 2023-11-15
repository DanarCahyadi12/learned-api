import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const Cookies = createParamDecorator((data, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const dataCookie = request.cookies?.[data];
  if (dataCookie) return dataCookie;
});
