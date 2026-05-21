export interface UserStats {
  totalBooks: number;
  totalConversations: number;
}

export interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  createdAt: string;
  updatedAt: string;
  stats: UserStats;
}

export interface UpdateUserDto {
  name?: string;
}

export type UsagePeriod = "day" | "week" | "month" | "all";

export interface DailyUsage {
  date: string;
  inputTokens: number;
  outputTokens: number;
  audioSeconds: number;
  cost: number;
  messages: number;
}

export interface ConversationUsage {
  id: string;
  title: string | null;
  bookTitle: string;
  messageCount: number;
  inputTokens: number;
  outputTokens: number;
  audioSeconds: number;
  cost: number;
  updatedAt: string;
}

export interface UsageStats {
  period: UsagePeriod;
  totalInputTokens: number;
  totalOutputTokens: number;
  totalAudioSeconds: number;
  totalCost: number;
  totalMessages: number;
  totalConversations: number;
  dailyBreakdown: DailyUsage[];
  topConversations: ConversationUsage[];
  costDelta: number | null;
  messagesDelta: number | null;
}
