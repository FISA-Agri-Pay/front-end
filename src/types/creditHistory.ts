export interface CreditUsageHistory {
  historyPublicId: string;
  usedAt: string;
  title: string;
  amount: number;
  usageType: string;
  orderStatus: string;
  deliveryStatus: string;
  displayStatus: string;
}

export interface CreditRepaymentHistory {
  transactionPublicId: string;
  transactedAt: string;
  title: string;
  transactionType: string;
  amount: number;
}
