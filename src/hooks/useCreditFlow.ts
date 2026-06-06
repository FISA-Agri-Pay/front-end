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

export function useStartSession() {
  return useMutation<StartSessionResponse, CreditApiError, void>({
    mutationFn: startSession,
  });
}

export function useSaveCrop() {
  return useMutation<void, CreditApiError, CropRequest>({
    mutationFn: saveCrop,
  });
}

export function useSaveLand() {
  return useMutation<void, CreditApiError, LandRequest>({
    mutationFn: saveLand,
  });
}

export function useSaveInsurance() {
  return useMutation<InsuranceResponse, CreditApiError, InsuranceRequest>({
    mutationFn: saveInsurance,
  });
}

interface SubmitCreditVariables {
  sessionId: string;
  files: SubmitFiles;
}

export function useSubmitCredit() {
  return useMutation<SubmitResponse, CreditApiError, SubmitCreditVariables>({
    mutationFn: ({ sessionId, files }) => submitCredit(sessionId, files),
  });
}
