import aiopsClient from './aiopsClient';
import type {
  ChatAskRequest,
  ChatAskResponse,
  ChatMessagesResponse,
  ChatSession,
  ChatSessionCreateRequest,
} from '../types/chatbot';

const ENDPOINTS = {
  SESSIONS: '/farmer/chat/sessions',
  SESSION: (sessionId: string) => `/farmer/chat/sessions/${sessionId}`,
  SESSION_MESSAGES: (sessionId: string) => `/farmer/chat/sessions/${sessionId}/messages`,
  SESSION_CLOSE: (sessionId: string) => `/farmer/chat/sessions/${sessionId}/close`,
  ASK: '/farmer/chat/ask',
} as const;

export async function createFarmerChatSession(
  body: ChatSessionCreateRequest,
): Promise<ChatSession> {
  const { data } = await aiopsClient.post<ChatSession>(ENDPOINTS.SESSIONS, body);
  return data;
}

export async function getFarmerChatSession(sessionId: string): Promise<ChatSession> {
  const { data } = await aiopsClient.get<ChatSession>(ENDPOINTS.SESSION(sessionId));
  return data;
}

export async function getFarmerChatMessages(sessionId: string): Promise<ChatMessagesResponse> {
  const { data } = await aiopsClient.get<ChatMessagesResponse>(ENDPOINTS.SESSION_MESSAGES(sessionId));
  return data;
}

export async function askFarmerChat(body: ChatAskRequest): Promise<ChatAskResponse> {
  const { data } = await aiopsClient.post<ChatAskResponse>(ENDPOINTS.ASK, body);
  return data;
}

export async function closeFarmerChatSession(sessionId: string): Promise<ChatSession> {
  const { data } = await aiopsClient.post<ChatSession>(ENDPOINTS.SESSION_CLOSE(sessionId));
  return data;
}
