export type CreditLimitStatus = 'ACTIVE' | 'SUSPENDED' | 'REPAID' | 'EXPIRED' | null;
export type ApplicationStatus = 'REQUESTED' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | null;

export interface WalletCredit {
  name: string;
  hasActiveLimit: boolean;
  creditLimitPublicId: string | null;
  totalLimit: number;
  usedAmount: number;
  remainingAmount: number;
  usageRate: number;
  status: CreditLimitStatus;
  applicationStatus: ApplicationStatus;
}

export interface WalletPrincipal {
  dueDate: string;
  remainingAmount: number;
  status: string;
}

export interface WalletInfo {
  walletPublicId: string;
  depositBankName: string;
  depositAccountNumber: string;
  balance: number;
  nextRepaymentDate: string | null;
  monthlyInterest: number | null;
  principal: WalletPrincipal | null;
  transactions: unknown[];
}
