import { createParamDecorator } from '@nestjs/common';

export const RequestUser = createParamDecorator((data, req) => {
  return req.user;
});
