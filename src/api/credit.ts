import coreClient from './coreClient';
import type {
  ApiResponse,
  CropRequest,
  InsuranceRequest,
  InsuranceResponse,
  LandRequest,
  StartSessionResponse,
  SubmitFiles,
  SubmitResponse,
} from '../types/credit';

// ─── 엔드포인트 상수 ──────────────────────────────────────────────────────────

const ENDPOINTS = {
  SESSION_START: '/api/v1/core/credit/session/start',
  CROP:          '/api/v1/core/credit/crop',
  LAND:          '/api/v1/core/credit/land',
  INSURANCE:     '/api/v1/core/credit/insurance',
  SUBMIT:        '/api/v1/core/credit/submit',
} as const;

// ─── API 함수 ─────────────────────────────────────────────────────────────────

export async function startSession(): Promise<StartSessionResponse> {
  const { data } = await coreClient.post<ApiResponse<StartSessionResponse>>(
    ENDPOINTS.SESSION_START,
  );
  return data.data;
}

export async function saveCrop(body: CropRequest): Promise<void> {
  await coreClient.post<ApiResponse<null>>(ENDPOINTS.CROP, body);
}

export async function saveLand(body: LandRequest): Promise<void> {
  await coreClient.post<ApiResponse<null>>(ENDPOINTS.LAND, body);
}

export async function saveInsurance(body: InsuranceRequest): Promise<InsuranceResponse> {
  const { data } = await coreClient.post<ApiResponse<InsuranceResponse>>(
    ENDPOINTS.INSURANCE,
    body,
  );
  return data.data;
}

export async function submitCredit(
  sessionId: string,
  files: SubmitFiles,
): Promise<SubmitResponse> {
  const form = new FormData();
  form.append('files[AGRI_MANAGEMENT_REGISTRATION]', files.AGRI_MANAGEMENT_REGISTRATION);
  if (files.CROP_DISASTER_INSURANCE) {
    form.append('files[CROP_DISASTER_INSURANCE]', files.CROP_DISASTER_INSURANCE);
  }

  // Content-Type을 undefined로 초기화해 axios가 FormData boundary를 자동 설정하도록 허용
  const { data } = await coreClient.post<ApiResponse<SubmitResponse>>(
    ENDPOINTS.SUBMIT,
    form,
    { params: { sessionId }, headers: { 'Content-Type': undefined } },
  );
  return data.data;
}
