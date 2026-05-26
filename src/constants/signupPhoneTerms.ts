export type PhoneTermKey = 'service' | 'privacy' | 'uniqueId' | 'identity';

export interface PhoneTermItem {
  key: PhoneTermKey;
  label: string;
}

export interface PhoneTermDetail {
  key: PhoneTermKey;
  title: string;
  countLabel: string;
  provider: 'NICE' | 'KCB';
  content: string[];
}

export const PHONE_TERM_ITEMS: PhoneTermItem[] = [
  { key: 'service', label: '서비스 이용약관 동의' },
  { key: 'privacy', label: '개인정보 수집/이용 동의' },
  { key: 'uniqueId', label: '고유식별정보처리' },
  { key: 'identity', label: '본인확인서비스' },
];

export const REQUIRED_PHONE_TERM_KEYS = PHONE_TERM_ITEMS.map((item) => item.key);

export const PHONE_TERM_DETAILS: Record<PhoneTermKey, PhoneTermDetail> = {
  service: {
    key: 'service',
    title: '[필수] 휴대폰 본인확인 서비스 이용약관',
    countLabel: '1 / 4',
    provider: 'NICE',
    content: [
      '본 약관은 NICE평가정보가 제공하는 휴대폰 본인확인 서비스 이용과 관련하여 필요한 사항을 정합니다.',
      '이용자는 본인 명의의 휴대폰 정보를 입력하고, 이동통신사를 통한 인증 절차를 거쳐 본인 여부를 확인합니다.',
      '회사는 안정적인 본인확인 서비스 제공을 위해 인증 요청 정보, 인증 결과 및 서비스 이용 기록을 처리할 수 있습니다.',
      '본 약관에서 정하지 않은 사항은 관련 법령 및 본인확인 기관의 운영 정책을 따릅니다.',
    ],
  },
  privacy: {
    key: 'privacy',
    title: '[필수] 개인정보 수집/이용 동의',
    countLabel: '2 / 4',
    provider: 'NICE',
    content: [
      '본인확인 기관은 본인확인 서비스 제공을 위해 필요한 개인정보를 수집하고 이용합니다.',
      '수집 항목: 이름, 생년월일, 성별, 내외국인 여부, 휴대폰 번호, 이동통신사, 인증 요청 및 결과 정보',
      '이용 목적: 본인확인, 중복가입 확인, 부정 이용 방지, 인증 이력 관리 및 고객 문의 처리',
      '보유 기간: 서비스 목적 달성 후 지체 없이 파기하되, 관련 법령에 따라 보관이 필요한 정보는 해당 기간 동안 보관합니다.',
    ],
  },
  uniqueId: {
    key: 'uniqueId',
    title: '[필수] 고유식별정보 처리 동의',
    countLabel: '3 / 4',
    provider: 'NICE',
    content: [
      '본인확인 기관은 본인확인 업무 수행을 위해 주민등록번호 등 고유식별정보를 관련 법령에 따라 처리할 수 있습니다.',
      '처리 목적: 본인 여부 확인, 명의도용 방지, 인증 결과 생성 및 인증기관 간 확인 업무',
      '처리 항목: 주민등록번호, 외국인등록번호 등 본인확인에 필요한 고유식별정보',
      '동의를 거부할 수 있으나, 동의하지 않을 경우 휴대폰 본인확인 서비스 이용이 제한될 수 있습니다.',
    ],
  },
  identity: {
    key: 'identity',
    title: '[필수] 본인확인서비스 동의',
    countLabel: '4 / 4',
    provider: 'NICE',
    content: [
      '본인확인 서비스는 이용자가 입력한 정보와 이동통신사 가입 정보를 비교하여 본인 여부를 확인하는 서비스입니다.',
      '본인확인 결과는 회원가입, 계정 보호, 금융성 서비스 신청 및 부정 이용 방지를 위해 이용될 수 있습니다.',
      '인증번호는 본인 명의의 휴대폰으로 발송되며, 이용자는 수신한 인증번호를 제한 시간 내에 입력해야 합니다.',
      '타인의 정보를 사용하거나 인증번호를 제3자에게 제공하는 경우 서비스 이용이 제한될 수 있습니다.',
    ],
  },
};
