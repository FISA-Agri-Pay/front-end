import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, MoreVertical, Plus, Send, Truck } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import { colors } from '../styles/colors';

type ChatMessageType = 'text' | 'credit-summary' | 'delivery-status' | 'recommendation';

type ChatCard =
  | {
      type: 'credit-summary';
      limit: number;
      used: number;
    }
  | {
      type: 'delivery-status';
      itemName: string;
      status: string;
    }
  | {
      type: 'recommendation';
      productName: string;
      price: number;
    };

type ChatMessage = {
  id: number;
  sender: 'assistant' | 'user';
  text: string;
  time?: string;
  type?: ChatMessageType;
  card?: ChatCard;
};

const quickQuestions = ['비료 추천해줘', '배송 현황 조회', '스마트팜 센서 문의'];

const CREDIT_LIMIT = 4000000;
const CREDIT_USED = 2500000;
const FERTILIZER_PRODUCT = { productName: '복합 비료 20kg', price: 50000 };
const SENSOR_PRODUCT = { productName: '스마트팜 센서 키트', price: 250000 };
const LATEST_DELIVERY = { itemName: '복합 비료 20kg', status: '배송 중' };

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

function getDemoReply(message: string): Pick<ChatMessage, 'text' | 'type' | 'card'> {
  if (message.includes('배송')) {
    return {
      type: 'delivery-status',
      text: `최근 주문하신 '${LATEST_DELIVERY.itemName}'는 현재 ${LATEST_DELIVERY.status}입니다.`,
      card: {
        type: 'delivery-status',
        ...LATEST_DELIVERY,
      },
    };
  }

  if (message.includes('센서')) {
    return {
      type: 'recommendation',
      text: `${SENSOR_PRODUCT.productName}는 토양 습도와 온도 확인에 적합해요. 상점에서 상세 정보를 확인할 수 있습니다.`,
      card: {
        type: 'recommendation',
        ...SENSOR_PRODUCT,
      },
    };
  }

  if (message.includes('비료') || message.includes('추천')) {
    return {
      type: 'recommendation',
      text: `현재 한도와 작물 정보를 기준으로 ${FERTILIZER_PRODUCT.productName}를 우선 추천드릴게요.`,
      card: {
        type: 'recommendation',
        ...FERTILIZER_PRODUCT,
      },
    };
  }

  if (message.includes('외상') || message.includes('잔액') || message.includes('한도')) {
    return {
      type: 'credit-summary',
      text: `현재 고객님의 외상 금액은 ${formatCurrency(CREDIT_USED)}입니다.`,
      card: {
        type: 'credit-summary',
        limit: CREDIT_LIMIT,
        used: CREDIT_USED,
      },
    };
  }

  return {
    type: 'text',
    text: '외상 한도, 상환, 배송 현황, 농자재 추천을 도와드릴 수 있어요.',
  };
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

  if (message.card?.type === 'credit-summary') {
    const remaining = message.card.limit - message.card.used;

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
            총 {formatCurrency(message.card.limit)} 한도
          </p>
          <p className="mt-2 text-[13px] font-bold" style={{ color: colors.text.muted }}>
            사용 {formatCurrency(message.card.used)} · 잔여 {formatCurrency(remaining)}
          </p>
        </div>
        <div className="px-4 pb-4">
          <Button style={{ height: 48, borderRadius: 12 }} onClick={() => navigate('/wallet')}>
            상환하러 가기
          </Button>
        </div>
      </div>
    );
  }

  if (message.card?.type === 'delivery-status') {
    return (
      <button
        type="button"
        onClick={() => navigate('/history')}
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
            {message.card.itemName}
          </p>
          <p className="mt-0.5 text-[13px] font-bold" style={{ color: colors.primary }}>
            {message.card.status}
          </p>
        </div>
      </button>
    );
  }

  if (message.card?.type === 'recommendation') {
    return (
      <div
        className="mt-3 rounded-[14px] bg-white p-4"
        style={{ border: '1px solid #E5E0D2' }}
      >
        <p className="text-[13px] font-bold" style={{ color: colors.text.muted }}>
          추천 상품
        </p>
        <p className="mt-1 text-[17px] font-extrabold" style={{ color: colors.text.dark }}>
          {message.card.productName}
        </p>
        <p className="mt-1 text-[14px] font-extrabold" style={{ color: colors.text.dark }}>
          {formatCurrency(message.card.price)}
        </p>
        <div className="mt-4">
          <Button variant="outline" style={{ height: 42, borderRadius: 12 }} onClick={() => navigate('/shop')}>
            상점에서 보기
          </Button>
        </div>
      </div>
    );
  }

  return null;
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
          style={{ color: '#111827' }}
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
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: 'assistant',
      type: 'text',
      text: '안녕하세요! 콩콩팥팥 농업 도우미입니다.\n무엇을 도와드릴까요?',
    },
    {
      id: 2,
      sender: 'user',
      text: '내 외상 잔액이 얼마야?',
      time: '오후 3:05',
    },
    {
      id: 3,
      sender: 'assistant',
      type: 'credit-summary',
      text: `현재 고객님의 외상 금액은 ${formatCurrency(CREDIT_USED)}입니다.`,
      card: {
        type: 'credit-summary',
        limit: CREDIT_LIMIT,
        used: CREDIT_USED,
      },
    },
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ block: 'end' });
  }, [messages]);

  const sendMessage = (message: string) => {
    const trimmed = message.trim();
    if (!trimmed) return;

    const reply = getDemoReply(trimmed);

    setMessages((current) => {
      const nextId = current.length + 1;

      return [
        ...current,
        {
          id: nextId,
          sender: 'user',
          text: trimmed,
          time: '방금',
        },
        {
          id: nextId + 1,
          sender: 'assistant',
          ...reply,
        },
      ];
    });
    setInput('');
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

      <main className="flex-1 overflow-y-auto px-4 pb-[154px] pt-6">
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
              className="h-10 shrink-0 rounded-full px-4 text-[14px] font-bold"
              style={{
                backgroundColor: colors.white,
                border: '1px solid #DCD6C2',
                color: colors.primary,
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
            placeholder="메시지를 입력하세요..."
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
            style={{ backgroundColor: colors.primary, opacity: input.trim() ? 1 : 0.5 }}
            disabled={!input.trim()}
          >
            <Send size={22} color={colors.white} />
          </button>
        </form>
      </footer>
    </div>
  );
}
