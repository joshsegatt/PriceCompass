
export type Page = 'home' | 'catalogue' | 'about' | 'favorites' | 'dashboard' | 'login' | 'privacy';

export enum Category {
  Broadband = 'Broadband',
  Energy = 'Energy',
  Insurance = 'Insurance',
  Mobile = 'Mobile',
  Loans = 'Loans',
  CreditCards = 'Credit Cards',
  CurrentAccounts = 'Current Accounts',
  Mortgages = 'Mortgages',
  Other = 'Other',
}

export enum KanbanStatus {
  Upcoming = 'Upcoming',
  Paid = 'Paid',
  Overdue = 'Overdue',
}

export interface TrackedBill {
  id: string;
  category: Category;
  provider: string;
  name: string;
  monthlyCost: number;
  dueDate: string; // ISO string format: YYYY-MM-DD
  status: KanbanStatus;
  source?: string;
}

export interface SavingsGoal {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    deadline: string; // ISO string format: YYYY-MM-DD
}

export type Board = 'overview' | 'bills' | 'savings';

export interface User {
  email: string;
  password?: string; // Password is now optional on the client-side user object for security
  isPremium: boolean;
  trackedBills: TrackedBill[];
  savingsGoals: SavingsGoal[];
}

export interface ProductFeature {
  label: string;
  value: string;
  highlight?: boolean;
}

export interface Product {
  id: string;
  category: Category;
  provider: string;
  planName: string;
  price: number;
  logoUrl: string;
  features: ProductFeature[];
  tags?: string[];
  promotion?: string;
  dealUrl?: string;
}

export enum FeedItemType {
  Alert = 'Alert',
  Insight = 'Insight',
  Gamification = 'Gamification',
  Recommendation = 'Recommendation',
  PremiumCTA = 'PremiumCTA',
}

export interface FeedItem {
  id: string;
  type: FeedItemType;
  title: string;
  description: string;
  icon: React.ReactNode;
  isPremiumLocked: boolean;
  ctaText?: string;
}

export type ToggleCompareFn = (product: Product) => void;