export type AgreementKey = 'age' | 'service' | 'privacy' | 'credit' | 'marketing';

export type AgreementDetailKey = Exclude<AgreementKey, 'age'>;

export interface AgreementItem {
  key: AgreementKey;
  label: string;
  required: boolean;
  hasDetail?: boolean;
}

export interface AgreementDetail {
  key: AgreementDetailKey;
  title: string;
  countLabel: string;
  content: string[];
}

export const AGREEMENT_ITEMS: AgreementItem[] = [
  { key: 'age', label: '만 19세 이상입니다', required: true },
  { key: 'service', label: '서비스 이용 약관', required: true, hasDetail: true },
  { key: 'privacy', label: '개인정보 수집·이용 동의', required: true, hasDetail: true },
  { key: 'credit', label: '신용정보 조회·제공 동의', required: true, hasDetail: true },
  { key: 'marketing', label: '마케팅 정보 수신', required: false, hasDetail: true },
];

export const REQUIRED_AGREEMENT_KEYS = AGREEMENT_ITEMS
  .filter((item) => item.required)
  .map((item) => item.key);

export const AGREEMENT_DETAILS: Record<AgreementDetailKey, AgreementDetail> = {
  service: {
    key: 'service',
    title: '[필수] 서비스 이용 약관',
    countLabel: '1 / 1',
    content: [
      '본 약관은 콩콩팥팥 서비스의 이용 조건과 절차, 회원과 회사의 권리·의무 및 책임사항을 정하기 위해 마련되었습니다.',
      '회원은 본 약관에 동의함으로써 서비스 가입, 본인 인증, 신용정보 조회, 한도 확인, 농자재 구매 및 결제 관련 기능을 이용할 수 있습니다.',
      '회사는 안정적인 서비스 제공을 위해 필요한 경우 서비스의 일부를 변경하거나 중단할 수 있으며, 중요한 변경 사항은 서비스 화면 또는 별도 공지로 안내합니다.',
      '회원은 본인의 정보를 정확하게 입력해야 하며, 타인의 정보를 도용하거나 허위 정보를 입력해서는 안 됩니다.',
      '본 약관에서 정하지 않은 사항은 관련 법령 및 회사의 운영 정책을 따릅니다.',
    ],
  },
  privacy: {
    key: 'privacy',
    title: '[필수] 개인정보 수집·이용 동의',
    countLabel: '1 / 1',
    content: [
      '회사는 회원가입, 본인 확인, 서비스 제공 및 상담 처리를 위해 필요한 최소한의 개인정보를 수집·이용합니다.',
      '수집 항목: 이름, 생년월일, 휴대폰 번호, 통신사, 본인 인증 결과, 신분증 확인 정보, 서비스 이용 기록',
      '이용 목적: 회원 식별, 본인 인증, 신용정보 조회 신청, 한도 확인, 구매 및 결제 서비스 제공, 고객 문의 대응',
      '보유 및 이용 기간: 회원 탈퇴 시까지 보관하며, 관련 법령에 따라 보존이 필요한 정보는 해당 기간 동안 별도 보관 후 파기합니다.',
      '회원은 개인정보 수집·이용 동의를 거부할 수 있으나, 필수 항목에 동의하지 않을 경우 회원가입 및 서비스 이용이 제한될 수 있습니다.',
    ],
  },
  credit: {
    key: 'credit',
    title: '[필수] 신용정보 조회·제공 동의',
    countLabel: '1 / 1',
    content: [
      '회사는 회원의 서비스 이용 가능 여부와 한도 확인을 위해 신용정보 조회 및 제공에 대한 동의를 받습니다.',
      '조회·제공 목적: 본인 확인, 신용도 판단, 서비스 한도 산정, 부정 이용 방지 및 거래 안정성 확인',
      '제공받는 자: 제휴 금융기관, 신용정보회사, 본인 인증 기관 및 서비스 운영에 필요한 업무 수탁사',
      '제공 항목: 이름, 생년월일, 휴대폰 번호, 본인 인증 정보, 신용거래 관련 정보, 서비스 신청 및 이용 내역',
      '보유 및 이용 기간: 서비스 목적 달성 시까지 보유하며, 법령상 보존 의무가 있는 경우 해당 기간 동안 보관합니다.',
      '회원은 동의를 거부할 수 있으나, 동의하지 않을 경우 신용정보 조회가 필요한 서비스 이용이 제한될 수 있습니다.',
    ],
  },
  marketing: {
    key: 'marketing',
    title: '[선택] 마케팅 정보 수신 동의',
    countLabel: '1 / 1',
    content: [
      '회사는 회원에게 혜택, 이벤트, 추천 상품, 서비스 안내 등 마케팅 정보를 제공하기 위해 수신 동의를 받습니다.',
      '수신 채널: 앱 알림, 문자메시지, 카카오 알림톡, 이메일 등 회원이 입력하거나 인증한 연락 수단',
      '이용 항목: 이름, 휴대폰 번호, 서비스 이용 기록, 관심 상품 및 이벤트 참여 내역',
      '보유 및 이용 기간: 동의 철회 또는 회원 탈퇴 시까지 보관하며, 이후 지체 없이 파기합니다.',
      '마케팅 정보 수신 동의는 선택 사항이며, 동의하지 않아도 회원가입 및 기본 서비스 이용에는 제한이 없습니다.',
    ],
  },
};
