export interface UserStats {
  totalBooks: number;
  totalConversations: number;
}

export interface AdminUserRow {
  id: string;
  name: string | null;
  email: string;
  role: "USER" | "ADMIN";
  isActive: boolean;
  createdAt: string;
  stats: UserStats;
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
  readerName: string;
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
  /** USD by source. Book indexing isn't logged by the API, so it's not here. */
  costBySource: { answers: number; whisper: number; tts: number };
  costDelta: number | null;
  messagesDelta: number | null;
  tokensDelta: number | null;
  audioDelta: number | null;
}

// GET /users/me/limits — free-tier usage, counted exactly like the API's guards
export interface TierLimits {
  /** ADMINs are exempt from all limits */
  unlimited: boolean;
  books: { used: number; limit: number };
  messages: { used: number; limit: number; resetsAt: string };
}
