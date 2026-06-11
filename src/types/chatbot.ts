export type ChatRole = 'USER' | 'ASSISTANT' | 'SYSTEM';
export type ChatStatus = 'OPEN' | 'CLOSED';

export interface ChatSession {
  session_id: string;
  chat_type: 'farmer_bnpl' | 'admin_copilot';
  user_id: string;
  title: string | null;
  status: ChatStatus;
  created_at: string;
  updated_at: string;
}

export interface ChatAction {
  label?: string;
  route?: string;
  endpoint?: string;
  method?: string;
}

export type ChatUiCard =
  | {
      type: 'credit-summary';
      limit?: number;
      used?: number;
      remaining?: number;
      currency?: 'KRW' | string;
      action?: ChatAction;
    }
  | {
      type: 'repayment-summary';
      next_due_date?: string;
      interest_due?: number;
      is_overdue?: boolean;
      overdue_amount?: number;
      action?: ChatAction;
    }
  | {
      type: 'recommendation';
      product_id?: string;
      product_name?: string;
      price?: number;
      reason?: string;
      action?: ChatAction;
    }
  | {
      type: 'delivery-status';
      order_id?: string;
      item_name?: string;
      delivery_status?: string;
      action?: ChatAction;
    }
  | {
      type: 'checkout-confirmation';
      checkout_intent_id?: string;
      total_amount?: number;
      expires_at?: string;
      action?: ChatAction;
    };

export interface ChatMessageResponse {
  message_id: string;
  session_id: string;
  role: ChatRole;
  content: string;
  created_at: string;
  mcp_tool_call_ids: string[];
  ui_cards: ChatUiCard[];
  ui_actions: ChatAction[];
  metadata: Record<string, unknown>;
}

export interface ChatSessionCreateRequest {
  user_id?: string;
  title?: string;
}

export interface ChatAskRequest {
  message: string;
  session_id?: string;
  user_id?: string;
}

export interface ChatMessagesResponse {
  session_id: string;
  items: ChatMessageResponse[];
}

export interface ChatAskResponse {
  session: ChatSession;
  user_message: ChatMessageResponse;
  assistant_message: ChatMessageResponse;
  job: {
    job_id: string;
    job_type: string;
    status: string;
    entity_type: string;
    entity_id: string;
    created_at: string;
    updated_at: string;
    error_message?: string | null;
  };
  llm_run: unknown | null;
  planned_tools: unknown[];
  tool_results: unknown[];
  ui_cards: ChatUiCard[];
  ui_actions: ChatAction[];
}
