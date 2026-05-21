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
