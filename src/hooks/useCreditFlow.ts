import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import {
  startSession,
  saveCrop,
  saveLand,
  saveInsurance,
  submitCredit,
} from '../api/credit';
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

type CreditApiError = AxiosError<ApiResponse<null>>;

// ─── 세션 시작 ────────────────────────────────────────────────────────────────

export function useStartSession() {
  return useMutation<StartSessionResponse, CreditApiError, void>({
    mutationFn: startSession,
  });
}

// ─── 작물 임시 저장 ───────────────────────────────────────────────────────────

export function useSaveCrop() {
  return useMutation<void, CreditApiError, CropRequest>({
    mutationFn: saveCrop,
  });
}

// ─── 농지 정보 저장 ───────────────────────────────────────────────────────────

export function useSaveLand() {
  return useMutation<void, CreditApiError, LandRequest>({
    mutationFn: saveLand,
  });
}

// ─── 보험 정보 저장 ───────────────────────────────────────────────────────────

export function useSaveInsurance() {
  return useMutation<InsuranceResponse, CreditApiError, InsuranceRequest>({
    mutationFn: saveInsurance,
  });
}

// ─── 최종 제출 ────────────────────────────────────────────────────────────────

interface SubmitCreditVariables {
  sessionId: string;
  files: SubmitFiles;
}

export function useSubmitCredit() {
  return useMutation<SubmitResponse, CreditApiError, SubmitCreditVariables>({
    mutationFn: ({ sessionId, files }) => submitCredit(sessionId, files),
  });
}
