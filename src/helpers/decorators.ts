import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiUseTags }             from '@nestjs/swagger';
import { Controller, Delete, Get, Head, Logger, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { Guards }                                                             from './guards';

function Action(title: string, type: any): MethodDecorator {
  return (target: Record<string, any>, key: string | symbol, descriptor: PropertyDescriptor): any => {
    const operationDescriptor = ApiOperation({
      title,
      operationId: String(key),
    })(target, key, descriptor);
    return ApiOkResponse({ type })(target, key, operationDescriptor as PropertyDescriptor);
  };
}

function createAction(methodDecorator: (path?: string) => MethodDecorator) {
  return (title: string, type: any, path?: string): MethodDecorator => {
    return (target: Record<string, any>, key: string | symbol, descriptor: PropertyDescriptor): any => {
      const actionDescriptor = Action(title, type)(target, key, descriptor);
      return methodDecorator(path)(target, key, actionDescriptor as TypedPropertyDescriptor<any>);
    };
  };
}

function createSecuredAction(methodDecorator: (path?: string) => MethodDecorator) {
  return (title: string, type: any, path?: string): MethodDecorator => {
    return (target: Record<string, any>, key: string | symbol, descriptor: PropertyDescriptor): any => {
      const actionDescriptor = Action(title, type)(target, key, descriptor);
      const guardsDescriptor = UseGuards(Guards)(target, String(key), actionDescriptor);
      const apiBearerAuthDescriptor = ApiBearerAuth()(target, key, guardsDescriptor);
      return methodDecorator(path)(target, key, apiBearerAuthDescriptor as TypedPropertyDescriptor<any>);
    };
  };
}

export const TagController = (prefix: string): ClassDecorator => {
  return (target: Function): void | any => {
    const tagsTarget = ApiUseTags(prefix)(target as object);
    return Controller(prefix)(tagsTarget);
  };
};

export const GetAction = createAction(Get);

export const PostAction = createAction(Post);

export const PatchAction = createAction(Patch);

export const DeleteAction = createAction(Delete);

export const PutAction = createAction(Put);

export const HeadAction = createAction(Head);

export const SecureGetAction = createSecuredAction(Get);

export const SecurePostAction = createSecuredAction(Post);

export const SecurePatchAction = createSecuredAction(Patch);

export const SecureDeleteAction = createSecuredAction(Delete);

export const SecurePutAction = createSecuredAction(Put);

export const SecureHeadAction = createSecuredAction(Head);
