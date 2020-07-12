import { Metadata } from 'grpc';
/* eslint-disable */
import { Empty } from './google/protobuf/empty';


export interface MessageIdDto {
  messageId: string;
}

export interface Message {
  id: string;
  title: string;
  content: string;
  isRead: boolean;
}

export interface MessageController {

  markMessageRead(request: MessageIdDto, meta: Metadata): Promise<Empty>;

}

export const MessageType = {
  INFO: 0 as const,
  WARNING: 1 as const,
  ERROR: 2 as const,
  UNRECOGNIZED: -1 as const,
}

export type MessageType = 0 | 1 | 2 | -1;
