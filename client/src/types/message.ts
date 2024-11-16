import { ReactNode } from "react";

export interface APIResponseMessage {
  id: string;
  message: string;
  createdAt: string;
  writtenByMe: boolean;
}

export interface ChatMessage extends APIResponseMessage {
  renderText?: ReactNode;
}
