export const API_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

export const DAILY_TARGETS = {
  kyc: 2,
  demat: 1.6,
  mf: 1.4,
  insurance: 1,
};

export const MONTHLY_TARGETS = {
  kyc: 50,
  demat: 40,
  mf: 35,
  insurance: 20,
};

export const METRIC_COLORS = {
  kyc: '#6366f1',
  demat: '#22c55e',
  mf: '#f59e0b',
  insurance: '#ec4899',
};

export const METRIC_LABELS: Record<string, string> = {
  kyc: 'KYC',
  demat: 'Demat',
  mf: 'Mutual Fund',
  insurance: 'Insurance',
};
