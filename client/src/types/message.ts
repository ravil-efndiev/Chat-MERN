export interface APIResponseMessage {
  id: string;
  message: string;
  createdAt: string;
  writtenByMe: boolean;
}

export type ChatMessage = APIResponseMessage;
