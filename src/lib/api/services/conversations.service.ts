import { apiClient } from "@/lib/api/client";
import { API_CONFIG } from "@/lib/api/config";
import {
  ConversationSummary,
  ConversationDetail,
  CreateConversationDto,
  AddMessageDto,
  MessageData,
  ChatResult,
} from "@/types/conversations.types";

const CONV = API_CONFIG.ENDPOINTS.CONVERSATIONS;

export const conversationsService = {
  list(bookId?: string): Promise<ConversationSummary[]> {
    const query = bookId ? `?bookId=${bookId}` : "";
    return apiClient.get<ConversationSummary[]>(`${CONV}${query}`);
  },

  get(id: string): Promise<ConversationDetail> {
    return apiClient.get<ConversationDetail>(`${CONV}/${id}`);
  },

  create(data: CreateConversationDto): Promise<ConversationDetail> {
    return apiClient.post<ConversationDetail>(CONV, data);
  },

  addMessage(id: string, data: AddMessageDto): Promise<MessageData> {
    return apiClient.post<MessageData>(`${CONV}/${id}/messages`, data);
  },

  chat(
    id: string,
    message: string,
    languageCode?: string,
  ): Promise<ChatResult> {
    return apiClient.post<ChatResult>(`${CONV}/${id}/chat`, {
      message,
      languageCode,
    });
  },

  // Change the reply language for the rest of the conversation
  update(
    id: string,
    data: { languageCode: string },
  ): Promise<Omit<ConversationSummary, "lastMessage">> {
    return apiClient.patch<Omit<ConversationSummary, "lastMessage">>(`${CONV}/${id}`, data);
  },

  delete(id: string): Promise<void> {
    return apiClient.delete<void>(`${CONV}/${id}`);
  },
};
