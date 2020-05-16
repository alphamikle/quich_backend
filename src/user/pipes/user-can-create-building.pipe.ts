import { Injectable, PipeTransform } from '@nestjs/common';
import { Metadata } from 'grpc';
import { rpcJsonException } from '~/providers/rpc-json-exception';
import { PropertyError } from '~/providers/property-error';
import { RU } from '~/locale/ru';

@Injectable()
class UserCanCreateBuildingPipe implements PipeTransform {
  private roles: string[] = [];

  constructor(roles: string | string[]) {
    if (Array.isArray(roles)) {
      this.roles.push(...roles);
    } else {
      this.roles.push(roles);
    }
  }

  async transform(value: any | Metadata): Promise<any | Metadata> {
    if (value instanceof Metadata) {
      const { user } = value;
      let hasRole = false;
      for (const role of this.roles) {
        if (user.role === role) {
          hasRole = true;
        }
      }
      if (!hasRole) {
        throw rpcJsonException(PropertyError.fromString(RU.operationNotPermitted));
      }
    }
    return value;
  }

}

export function validateRoles(...roles: string[]) {
  return new UserCanCreateBuildingPipe(roles);
}