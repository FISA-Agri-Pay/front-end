import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, MoreVertical, Plus, Send, Truck } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import { colors } from '../styles/colors';
import {
  askFarmerChat,
  createFarmerChatSession,
  getFarmerChatMessages,
  getFarmerChatSession,
} from '../api/chatbot';
import { tokenStorage } from '../api/tokenStorage';
import type { ChatMessageResponse, ChatUiCard } from '../types/chatbot';

type ChatCard =
  | {
      type: 'credit-summary';
      limit: number;
      used: number;
      remaining: number;
      actionRoute?: string;
      actionLabel?: string;
    }
  | {
      type: 'repayment-summary';
      nextDueDate?: string;
      interestDue: number;
      isOverdue: boolean;
      overdueAmount: number;
      actionRoute?: string;
      actionLabel?: string;
    }
  | {
      type: 'delivery-status';
      itemName: string;
      status: string;
      actionRoute?: string;
      actionLabel?: string;
    }
  | {
      type: 'recommendation';
      productName: string;
      price: number;
      reason?: string;
      actionRoute?: string;
      actionLabel?: string;
    }
  | {
      type: 'checkout-confirmation';
      checkoutIntentId?: string;
      totalAmount: number;
      expiresAt?: string;
      actionLabel?: string;
    };

type ChatMessage = {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
  time?: string;
  card?: ChatCard;
  isError?: boolean;
};

const quickQuestions = ['비료 추천해줘', '배송 현황 조회', '스마트팜 센서 문의'];
const LEGACY_CHAT_SESSION_STORAGE_KEY = 'farmerChatSessionId';
const CHAT_SESSION_STORAGE_KEY_PREFIX = 'farmerChatSessionId:';

const currencyFormatter = new Intl.NumberFormat('ko-KR');

function formatCurrency(amount: number) {
  return `${currencyFormatter.format(amount)}원`;
}

function formatKoreanDate(date: Date) {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(date);
}

function formatMessageTime(value?: string) {
  if (!value) return undefined;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;

  return new Intl.DateTimeFormat('ko-KR', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

function getNumber(value: unknown, fallback = 0) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function normalizeCard(card: ChatUiCard): ChatCard | undefined {
  if (card.type === 'credit-summary') {
    const limit = getNumber(card.limit);
    const used = getNumber(card.used);
    const remaining = getNumber(card.remaining, limit - used);

    return {
      type: 'credit-summary',
      limit,
      used,
      remaining,
      actionRoute: card.action?.route,
      actionLabel: card.action?.label,
    };
  }

  if (card.type === 'repayment-summary') {
    return {
      type: 'repayment-summary',
      nextDueDate: card.next_due_date,
      interestDue: getNumber(card.interest_due),
      isOverdue: Boolean(card.is_overdue),
      overdueAmount: getNumber(card.overdue_amount),
      actionRoute: card.action?.route,
      actionLabel: card.action?.label,
    };
  }

  if (card.type === 'recommendation') {
    return {
      type: 'recommendation',
      productName: card.product_name ?? '추천 상품',
      price: getNumber(card.price),
      reason: card.reason,
      actionRoute: card.action?.route,
      actionLabel: card.action?.label,
    };
  }

  if (card.type === 'delivery-status') {
    return {
      type: 'delivery-status',
      itemName: card.item_name ?? '최근 주문',
      status: card.delivery_status ?? '배송 상태 확인 중',
      actionRoute: card.action?.route,
      actionLabel: card.action?.label,
    };
  }

  if (card.type === 'checkout-confirmation') {
    return {
      type: 'checkout-confirmation',
      checkoutIntentId: card.checkout_intent_id,
      totalAmount: getNumber(card.total_amount),
      expiresAt: card.expires_at,
      actionLabel: card.action?.label,
    };
  }

  return undefined;
}

function makeGreetingMessage(): ChatMessage {
  return {
    id: 'local-greeting',
    sender: 'assistant',
    text: '안녕하세요! 콩콩팥팥 농업 도우미입니다.\n무엇을 도와드릴까요?',
  };
}

function makeErrorMessage(id: string, text: string): ChatMessage {
  return {
    id,
    sender: 'assistant',
    text,
    isError: true,
  };
}

function mapApiMessage(message: ChatMessageResponse, fallbackCards: ChatUiCard[] = []): ChatMessage {
  const uiCards = message.ui_cards.length > 0 ? message.ui_cards : fallbackCards;
  const firstCard = uiCards.map(normalizeCard).find((card): card is ChatCard => Boolean(card));

  return {
    id: message.message_id,
    sender: message.role === 'USER' ? 'user' : 'assistant',
    text: message.content,
    time: formatMessageTime(message.created_at),
    card: firstCard,
  };
}

function getHttpStatus(error: unknown) {
  if (typeof error !== 'object' || error === null || !('response' in error)) return undefined;

  const response = (error as { response?: { status?: unknown } }).response;
  return typeof response?.status === 'number' ? response.status : undefined;
}

function getChatSessionStorageKey(userId: string) {
  return `${CHAT_SESSION_STORAGE_KEY_PREFIX}${userId}`;
}

function AssistantAvatar() {
  return (
    <div
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
      style={{ backgroundColor: colors.primary }}
    >
      <Bot size={21} color={colors.white} strokeWidth={2.2} />
    </div>
  );
}

function AssistantCard({ message }: { message: ChatMessage }) {
  const navigate = useNavigate();
  const card = message.card;

  if (!card) return null;

  const navigateTo = (route: string | undefined, fallbackRoute: string) => {
    navigate(route ?? fallbackRoute);
  };

  if (card.type === 'credit-summary') {
    return (
      <div
        className="mt-3 overflow-hidden rounded-[14px] bg-white"
        style={{ border: '1px solid #E5E0D2' }}
      >
        <div className="px-4 py-4">
          <p className="text-[13px] font-bold" style={{ color: colors.text.muted }}>
            외상 한도 현황
          </p>
          <p className="mt-1 text-[22px] font-extrabold leading-7" style={{ color: colors.text.dark }}>
            총 {formatCurrency(card.limit)} 한도
          </p>
          <p className="mt-2 text-[13px] font-bold" style={{ color: colors.text.muted }}>
            사용 {formatCurrency(card.used)} · 잔여 {formatCurrency(card.remaining)}
          </p>
        </div>
        <div className="px-4 pb-4">
          <Button
            style={{ height: 48, borderRadius: 12 }}
            onClick={() => navigateTo(card.actionRoute, '/wallet')}
          >
            {card.actionLabel ?? '상환하러 가기'}
          </Button>
        </div>
      </div>
    );
  }

  if (card.type === 'repayment-summary') {
    return (
      <div
        className="mt-3 rounded-[14px] bg-white p-4"
        style={{ border: '1px solid #E5E0D2' }}
      >
        <p className="text-[13px] font-bold" style={{ color: colors.text.muted }}>
          다음 상환 정보
        </p>
        <p className="mt-1 text-[17px] font-extrabold" style={{ color: colors.text.dark }}>
          {card.nextDueDate ?? '상환일 확인 중'}
        </p>
        <p className="mt-2 text-[13px] font-bold" style={{ color: colors.text.muted }}>
          이자 {formatCurrency(card.interestDue)}
        </p>
        {card.isOverdue && (
          <p className="mt-1 text-[13px] font-bold" style={{ color: colors.text.danger }}>
            연체 {formatCurrency(card.overdueAmount)}
          </p>
        )}
        <div className="mt-4">
          <Button
            variant="outline"
            style={{ height: 42, borderRadius: 12 }}
            onClick={() => navigateTo(card.actionRoute, '/wallet')}
          >
            {card.actionLabel ?? '상환 정보 보기'}
          </Button>
        </div>
      </div>
    );
  }

  if (card.type === 'delivery-status') {
    return (
      <button
        type="button"
        onClick={() => navigateTo(card.actionRoute, '/history')}
        className="mt-3 flex w-full items-center gap-3 rounded-[14px] bg-white px-4 py-3 text-left"
        style={{ border: '1px solid #E5E0D2' }}
      >
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: colors.bg }}
        >
          <Truck size={20} color={colors.text.muted} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-extrabold leading-5" style={{ color: colors.text.dark }}>
            {card.itemName}
          </p>
          <p className="mt-0.5 text-[13px] font-bold" style={{ color: colors.primary }}>
            {card.status}
          </p>
        </div>
      </button>
    );
  }

  if (card.type === 'recommendation') {
    return (
      <div
        className="mt-3 rounded-[14px] bg-white p-4"
        style={{ border: '1px solid #E5E0D2' }}
      >
        <p className="text-[13px] font-bold" style={{ color: colors.text.muted }}>
          추천 상품
        </p>
        <p className="mt-1 text-[17px] font-extrabold" style={{ color: colors.text.dark }}>
          {card.productName}
        </p>
        <p className="mt-1 text-[14px] font-extrabold" style={{ color: colors.text.dark }}>
          {formatCurrency(card.price)}
        </p>
        {card.reason && (
          <p className="mt-2 text-[12px] font-bold leading-5" style={{ color: colors.text.muted }}>
            {card.reason}
          </p>
        )}
        <div className="mt-4">
          <Button
            variant="outline"
            style={{ height: 42, borderRadius: 12 }}
            onClick={() => navigateTo(card.actionRoute, '/shop')}
          >
            {card.actionLabel ?? '상점에서 보기'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="mt-3 rounded-[14px] bg-white p-4"
      style={{ border: '1px solid #E5E0D2' }}
    >
      <p className="text-[13px] font-bold" style={{ color: colors.text.muted }}>
        결제 승인 준비
      </p>
      <p className="mt-1 text-[17px] font-extrabold" style={{ color: colors.text.dark }}>
        {formatCurrency(card.totalAmount)}
      </p>
      {card.expiresAt && (
        <p className="mt-2 text-[12px] font-bold" style={{ color: colors.text.muted }}>
          만료 시각 {card.expiresAt}
        </p>
      )}
      <div className="mt-4">
        <Button disabled style={{ height: 42, borderRadius: 12 }}>
          {card.actionLabel ?? '승인 API 준비 중'}
        </Button>
      </div>
    </div>
  );
}

function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.sender === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="flex max-w-[78%] items-end gap-2">
          {message.time && (
            <span className="text-[12px]" style={{ color: '#9AA0AE' }}>
              {message.time}
            </span>
          )}
          <div
            className="rounded-[18px] rounded-br-[6px] px-4 py-3"
            style={{ backgroundColor: colors.primary, color: colors.white }}
          >
            <p className="text-[16px] font-medium leading-6">{message.text}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3">
      <AssistantAvatar />
      <div className="min-w-0 flex-1">
        <p className="mb-1 text-[13px] font-medium" style={{ color: colors.text.mid }}>
          콩콩팥팥 도우미
        </p>
        <div
          className="inline-block max-w-full rounded-[18px] rounded-tl-[6px] bg-white px-4 py-3"
          style={{ color: message.isError ? colors.text.danger : '#111827' }}
        >
          <p className="whitespace-pre-line text-[16px] font-medium leading-6">{message.text}</p>
        </div>
        <AssistantCard message={message} />
      </div>
    </div>
  );
}

export default function ChatbotPage() {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [chatDateLabel] = useState(() => formatKoreanDate(new Date()));
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([makeGreetingMessage()]);
  const [isBooting, setIsBooting] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const localMessageIdRef = useRef(0);
  const chatUserId = tokenStorage.getUserPublicId();
  const chatSessionStorageKey = chatUserId ? getChatSessionStorageKey(chatUserId) : null;

  const createLocalMessageId = (prefix: string) => {
    localMessageIdRef.current += 1;
    return `${prefix}-${localMessageIdRef.current}`;
  };

  useEffect(() => {
    let isMounted = true;

    async function initializeSession() {
      setIsBooting(true);
      sessionStorage.removeItem(LEGACY_CHAT_SESSION_STORAGE_KEY);

      if (!chatUserId || !chatSessionStorageKey) {
        setSessionId(null);
        setMessages([
          makeGreetingMessage(),
          makeErrorMessage(
            'local-auth-error',
            '사용자 정보를 확인하지 못했습니다. 다시 로그인한 뒤 이용해 주세요.',
          ),
        ]);
        setIsBooting(false);
        return;
      }

      const savedSessionId = sessionStorage.getItem(chatSessionStorageKey);

      try {
        if (savedSessionId) {
          const savedSession = await getFarmerChatSession(savedSessionId);
          if (savedSession.user_id !== chatUserId) {
            throw new Error('Saved chat session belongs to a different user.');
          }
          const history = await getFarmerChatMessages(savedSessionId);

          if (!isMounted) return;

          setSessionId(savedSessionId);
          setMessages(
            history.items.length > 0
              ? history.items.map((message) => mapApiMessage(message))
              : [makeGreetingMessage()],
          );
          return;
        }

        const session = await createFarmerChatSession({
          user_id: chatUserId,
          title: '콩콩팥팥 도우미',
        });

        if (!isMounted) return;

        sessionStorage.setItem(chatSessionStorageKey, session.session_id);
        setSessionId(session.session_id);
        setMessages([makeGreetingMessage()]);
      } catch {
        sessionStorage.removeItem(chatSessionStorageKey);

        if (!isMounted) return;

        setMessages([
          makeGreetingMessage(),
          makeErrorMessage(
            'local-session-error',
            '챗봇 세션을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.',
          ),
        ]);
      } finally {
        if (isMounted) setIsBooting(false);
      }
    }

    initializeSession();

    return () => {
      isMounted = false;
    };
  }, [chatSessionStorageKey, chatUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ block: 'end' });
  }, [messages, isSending]);

  const ensureSession = async () => {
    if (!chatUserId || !chatSessionStorageKey) {
      throw new Error('Chat user id is missing.');
    }

    if (sessionId) return sessionId;

    const session = await createFarmerChatSession({
      user_id: chatUserId,
      title: '콩콩팥팥 도우미',
    });

    sessionStorage.setItem(chatSessionStorageKey, session.session_id);
    setSessionId(session.session_id);
    return session.session_id;
  };

  const sendMessage = async (message: string) => {
    const trimmed = message.trim();
    if (!trimmed || isSending) return;

    if (!chatUserId) {
      setMessages((current) => [
        ...current,
        makeErrorMessage(
          createLocalMessageId('local-auth-error'),
          '사용자 정보를 확인하지 못했습니다. 다시 로그인한 뒤 이용해 주세요.',
        ),
      ]);
      return;
    }

    const localUserMessage: ChatMessage = {
      id: createLocalMessageId('local-user'),
      sender: 'user',
      text: trimmed,
      time: '방금',
    };

    setMessages((current) => [...current, localUserMessage]);
    setInput('');
    setIsSending(true);

    try {
      const currentSessionId = await ensureSession();
      const response = await askFarmerChat({
        message: trimmed,
        session_id: currentSessionId,
        user_id: chatUserId,
      });

      setSessionId(response.session.session_id);
      if (chatSessionStorageKey) {
        sessionStorage.setItem(chatSessionStorageKey, response.session.session_id);
      }

      setMessages((current) => [
        ...current,
        mapApiMessage(response.assistant_message, response.ui_cards),
      ]);
    } catch (error) {
      const status = getHttpStatus(error);
      const message =
        status === 404
          ? '챗봇 세션이 만료되었습니다. 새로고침 후 다시 질문해 주세요.'
          : '답변을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.';

      setMessages((current) => [
        ...current,
        makeErrorMessage(createLocalMessageId('local-error'), message),
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="flex min-h-screen flex-col" style={{ backgroundColor: colors.bg }}>
      <PageHeader
        title="콩콩팥팥 도우미"
        onBack={() => navigate(-1)}
        rightAction={
          <button
            type="button"
            aria-label="챗봇 메뉴 준비 중"
            title="챗봇 메뉴 준비 중"
            className="flex h-8 w-8 items-center justify-center"
            disabled
          >
            <MoreVertical size={22} color={colors.text.dark} />
          </button>
        }
      />

      <main className="flex-1 overflow-y-auto px-4 pb-[166px] pt-6">
        <div
          className="mx-auto mb-8 w-fit rounded-full px-4 py-2 text-[13px] font-bold"
          style={{ backgroundColor: '#EBE8E0', color: '#6F7583' }}
        >
          {chatDateLabel}
        </div>
        <div className="flex flex-col gap-8">
          {messages.map((message) => (
            <ChatBubble key={message.id} message={message} />
          ))}
          {isSending && (
            <div className="flex items-start gap-3">
              <AssistantAvatar />
              <div
                className="rounded-[18px] rounded-tl-[6px] bg-white px-4 py-3 text-[14px] font-bold"
                style={{ color: colors.text.muted }}
              >
                답변을 준비하고 있어요...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer
        className="fixed bottom-0 left-1/2 w-full max-w-[390px] -translate-x-1/2 bg-white"
        style={{ borderTop: '1px solid #E5E0D2' }}
      >
        <div className="flex gap-2 overflow-x-auto px-4 py-3" style={{ scrollbarWidth: 'none' }}>
          {quickQuestions.map((question) => (
            <button
              key={question}
              type="button"
              onClick={() => sendMessage(question)}
              disabled={isBooting || isSending}
              className="h-10 shrink-0 rounded-full px-4 text-[14px] font-bold"
              style={{
                backgroundColor: colors.white,
                border: '1px solid #DCD6C2',
                color: colors.primary,
                opacity: isBooting || isSending ? 0.5 : 1,
              }}
            >
              {question}
            </button>
          ))}
        </div>
        <form className="flex items-center gap-2 px-4 pb-5 pt-2" onSubmit={handleSubmit}>
          <button
            type="button"
            aria-label="첨부 기능 준비 중"
            title="첨부 기능 준비 중"
            className="flex h-10 w-10 shrink-0 items-center justify-center"
            disabled
          >
            <Plus size={25} color="#9AA0AE" />
          </button>
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            disabled={isBooting}
            placeholder={isBooting ? '챗봇을 연결하고 있어요...' : '메시지를 입력하세요...'}
            className="h-12 min-w-0 flex-1 rounded-full border px-5 text-[15px] font-bold outline-none"
            style={{
              backgroundColor: '#F6F7F8',
              borderColor: '#DEE2EA',
              color: colors.text.dark,
            }}
          />
          <button
            type="submit"
            aria-label="메시지 보내기"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
            style={{
              backgroundColor: colors.primary,
              opacity: input.trim() && !isBooting && !isSending ? 1 : 0.5,
            }}
            disabled={!input.trim() || isBooting || isSending}
          >
            <Send size={22} color={colors.white} />
          </button>
        </form>
      </footer>
    </div>
  );
}
