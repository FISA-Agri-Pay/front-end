// ─── 공통 응답 래퍼 ──────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  status: string;
  data: T;
  errorCode?: string;
  message?: string;
}

// ─── 작물 코드 ────────────────────────────────────────────────────────────────

export type CropCode = 'RICE' | 'BEAN' | 'PEPPER' | 'ONION' | 'GARLIC' | 'CUSTOM';

// ─── 세션 ─────────────────────────────────────────────────────────────────────

export interface StartSessionResponse {
  sessionId: string;
  /** ISO 8601 형식 만료 일시 */
  expiresAt: string;
}

// ─── 작물 ─────────────────────────────────────────────────────────────────────

export interface CropRequest {
  sessionId: string;
  cropType: CropCode;
}

// ─── 농지 ─────────────────────────────────────────────────────────────────────

export interface LandRequest {
  sessionId: string;
  address: string;
  areaSize: number;
}

// ─── 보험 ─────────────────────────────────────────────────────────────────────

export interface InsuranceRequest {
  sessionId: string;
  hasInsurance: boolean;
}

export type DocumentCode =
  | 'AGRI_MANAGEMENT_REGISTRATION'
  | 'CROP_DISASTER_INSURANCE';

export interface RequiredDocument {
  documentCode: DocumentCode;
  documentName: string;
  isRequired: boolean;
}

export interface InsuranceResponse {
  requiredDocuments: RequiredDocument[];
}

// ─── 최종 제출 ────────────────────────────────────────────────────────────────

export interface SubmitFiles {
  /** 농업 경영체 등록 확인서 (항상 필수) */
  AGRI_MANAGEMENT_REGISTRATION: File;
  /** 농작물 재해보험 가입 증명서 (보험 가입 시 필수) */
  CROP_DISASTER_INSURANCE?: File;
}

export interface SubmitResponse {
  applicationId: string;
  /** 심사 상태 (예: UNDER_REVIEW) */
  status: string;
  /** 예상 처리 기간 (예: "1~3일") */
  estimatedCompletion: string;
}

/**
 * 제출 에러 코드
 * - SES-001: 세션 ID 누락                (400)
 * - SES-002: 유효하지 않은 세션           (404)
 * - SES-003: 만료된 세션                  (410)
 * - DOC-001: 필수 서류 누락               (400)
 * - DOC-002: 파일 크기 제한 초과          (413)
 * - DOC-003: 지원하지 않는 파일 형식      (415)
 * - APP-001: 이미 진행 중인 심사 존재     (409)
 * - APP-002: 신청 단계 정보 누락          (400)
 */
export type SubmitErrorCode =
  | 'SES-001'
  | 'SES-002'
  | 'SES-003'
  | 'DOC-001'
  | 'DOC-002'
  | 'DOC-003'
  | 'APP-001'
  | 'APP-002';
