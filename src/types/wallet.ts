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
