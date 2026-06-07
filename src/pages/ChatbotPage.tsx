import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, MoreVertical, Plus, Send, Truck } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import { colors } from '../styles/colors';

type ChatMessageType = 'text' | 'credit-summary' | 'delivery-status' | 'recommendation';

type ChatMessage = {
  id: number;
  sender: 'assistant' | 'user';
  text: string;
  time?: string;
  type?: ChatMessageType;
};

const quickQuestions = ['비료 추천해줘', '배송 현황 조회', '스마트팜 센서 문의'];

const creditLimit = 4000000;
const creditUsed = 2500000;

function getDemoReply(message: string): Pick<ChatMessage, 'text' | 'type'> {
  if (message.includes('배송')) {
    return {
      type: 'delivery-status',
      text: "최근 주문하신 '복합 비료 20kg'는 현재 배송 중입니다.",
    };
  }

  if (message.includes('비료') || message.includes('추천')) {
    return {
      type: 'recommendation',
      text: '현재 한도와 작물 정보를 기준으로 복합 비료 20kg를 우선 추천드릴게요.',
    };
  }

  if (message.includes('센서')) {
    return {
      type: 'recommendation',
      text: '스마트팜 센서 키트는 토양 습도와 온도 확인에 적합해요. 상점에서 상세 정보를 확인할 수 있습니다.',
    };
  }

  if (message.includes('외상') || message.includes('잔액') || message.includes('한도')) {
    return {
      type: 'credit-summary',
      text: `현재 고객님의 외상 금액은 ${creditUsed.toLocaleString()}원입니다.`,
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

  if (message.type === 'credit-summary') {
    const remaining = creditLimit - creditUsed;

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
            총 {creditLimit.toLocaleString()}원 한도
          </p>
          <p className="mt-2 text-[13px] font-bold" style={{ color: colors.text.muted }}>
            사용 {creditUsed.toLocaleString()}원 · 잔여 {remaining.toLocaleString()}원
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

  if (message.type === 'delivery-status') {
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
            복합 비료 20kg
          </p>
          <p className="mt-0.5 text-[13px] font-bold" style={{ color: colors.primary }}>
            배송 중
          </p>
        </div>
      </button>
    );
  }

  if (message.type === 'recommendation') {
    return (
      <div
        className="mt-3 rounded-[14px] bg-white p-4"
        style={{ border: '1px solid #E5E0D2' }}
      >
        <p className="text-[13px] font-bold" style={{ color: colors.text.muted }}>
          추천 상품
        </p>
        <p className="mt-1 text-[17px] font-extrabold" style={{ color: colors.text.dark }}>
          복합 비료 20kg
        </p>
        <p className="mt-1 text-[14px] font-extrabold" style={{ color: colors.text.dark }}>
          50,000원
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
            style={{ backgroundColor: '#2F7D35', color: colors.white }}
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
      text: `현재 고객님의 외상 금액은 ${creditUsed.toLocaleString()}원입니다.`,
    },
  ]);

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

  return (
    <div className="flex min-h-screen flex-col" style={{ backgroundColor: colors.bg }}>
      <PageHeader
        title="콩콩팥팥 도우미"
        onBack={() => navigate(-1)}
        rightAction={
          <button type="button" aria-label="챗봇 메뉴" className="flex h-8 w-8 items-center justify-center">
            <MoreVertical size={22} color={colors.text.dark} />
          </button>
        }
      />

      <main className="flex-1 overflow-y-auto px-4 pb-[154px] pt-6">
        <div
          className="mx-auto mb-8 w-fit rounded-full px-4 py-2 text-[13px] font-bold"
          style={{ backgroundColor: '#EBE8E0', color: '#6F7583' }}
        >
          2026년 6월 6일 토요일
        </div>
        <div className="flex flex-col gap-8">
          {messages.map((message) => (
            <ChatBubble key={message.id} message={message} />
          ))}
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
        <div className="flex items-center gap-2 px-4 pb-5 pt-2">
          <button type="button" aria-label="첨부 추가" className="flex h-10 w-10 shrink-0 items-center justify-center">
            <Plus size={25} color="#9AA0AE" />
          </button>
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') sendMessage(input);
            }}
            placeholder="메시지를 입력하세요..."
            className="h-12 min-w-0 flex-1 rounded-full border px-5 text-[15px] font-bold outline-none"
            style={{
              backgroundColor: '#F6F7F8',
              borderColor: '#DEE2EA',
              color: colors.text.dark,
            }}
          />
          <button
            type="button"
            aria-label="메시지 보내기"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: colors.primary }}
            onClick={() => sendMessage(input)}
          >
            <Send size={22} color={colors.white} />
          </button>
        </div>
      </footer>
    </div>
  );
}
