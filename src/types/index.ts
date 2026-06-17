export type Role = 'admin' | 'manager' | 'telecaller';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  performancePercent?: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface MetricEntry {
  date: string;
  kyc: number;
  demat: number;
  mf: number;
  insurance: number;
  algo?: number;
  coaching?: number;
  notes?: string;
}

export interface LeaderboardRow {
  rank: number;
  userId: string;
  email: string;
  kyc: number;
  demat: number;
  mf: number;
  insurance: number;
  avgScore: number;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  earnedAt: string;
}
