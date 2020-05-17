import { Injectable, PipeTransform } from '@nestjs/common';
import { Metadata, status } from 'grpc';
import { UserService } from '~/user/user.service';
import { AuthService } from '~/auth/auth.service';
import { rpcJsonException } from '~/providers/rpc-json-exception';
import { PropertyError } from '~/providers/property-error';
import { RU } from '~/locale/ru';
import { DateProvider } from '~/providers/date.provider';
import { User } from '~/user/entities/user.entity';
import { Session } from '~/user/entities/session.entity';

interface SessionCache {
  user: User;
  expiredAt: number;
}

@Injectable()
export class ValidateUserTokenPipe implements PipeTransform {
  private cache: Map<string, SessionCache> = new Map();

  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly dateProvider: DateProvider,
  ) {
  }

  async transform(value: Record<string, any>): Promise<Record<string, any>> {
    if (value instanceof Metadata) {
      let user: User | null = null;
      const token = this.extractToken(value.get('security-token') as string[]);
      if (this.hasCacheUserForToken(token)) {
        user = this.getUserFromCache(token);
      }
      if (user === null) {
        const session = await this.getSession(token);
        await this.validateSession(session);
        user = await this.userService.getUserByToken(session.token) as User;
        this.setUserToCache(token, user);
      }
      value.user = user;
    }
    return value;
  }

  private async getSession(token: string): Promise<Session> {
    const session = await this.authService.getSessionByToken(token);
    if (!session) {
      throw rpcJsonException(PropertyError.fromString(RU.notFoundSession), status.UNAUTHENTICATED);
    }
    return session;
  }

  private async validateSession(session: Session): Promise<void> {
    const isSessionValid = await this.authService.isSessionValid(session);
    if (!isSessionValid) {
      throw rpcJsonException(PropertyError.fromString(`${ RU.sessionInvalidated } ${ this.dateProvider.format(session.expiredAt, 'dd-MM-yyyy HH:ss') }`), status.UNAUTHENTICATED);
    }
  }

  private hasCacheUserForToken(token: string): boolean {
    return this.cache.has(token);
  }

  private getUserFromCache(token: string): User | null {
    const session = this.cache.get(token) as SessionCache;
    if (session.expiredAt > Date.now()) {
      return session.user;
    }
    this.cache.delete(token);
    return null;
  }

  private setUserToCache(token: string, user: User): void {
    this.cache.set(token, {
      expiredAt: Date.now() + 1000 * 60 * 10,
      user,
    });
  }

  private extractToken = (securityToken: string[]): string => {
    let token: string;
    if (!securityToken) {
      throw rpcJsonException(PropertyError.fromString(RU.notFoundAuthHeader), status.UNAUTHENTICATED);
    }
    if (Array.isArray(securityToken)) {
      [token] = securityToken;
    } else {
      token = securityToken;
    }
    if (!token) {
      throw rpcJsonException(PropertyError.fromString(RU.notFoundAuthHeader), status.UNAUTHENTICATED);
    }
    return token;
  };

}