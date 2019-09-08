import { AuthGuard } from '@nestjs/passport';

export const Guards = AuthGuard('bearer');
