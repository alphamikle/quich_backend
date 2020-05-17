import { User } from '~/user/entities/user.entity';

type DifferentKeys<First, Second> = {
  [K in keyof First]: K extends keyof Second ? First[K] extends Second[K] ? never : K : K;
}

export type Diff<First, Second> = Partial<Pick<First, DifferentKeys<First, Second>[keyof First]>>;

export type ConvertWithDiff<T, R> = [T, Diff<T, R>];

declare module 'grpc' {
  // eslint-disable-next-line
  // @ts-ignore
  // eslint-disable-next-line
  import { Metadata } from 'grpc';

  export interface Metadata {
    user: User;
  }
}