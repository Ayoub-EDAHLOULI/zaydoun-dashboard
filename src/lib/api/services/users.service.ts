import { apiClient } from "@/lib/api/client";
import { API_CONFIG } from "@/lib/api/config";
import {
  UserProfile,
  UpdateUserDto,
  UsageStats,
  UsagePeriod,
} from "@/types/users.types";

const USERS = API_CONFIG.ENDPOINTS.USERS;

export const usersService = {
  getMe(): Promise<UserProfile> {
    return apiClient.get<UserProfile>(`${USERS}/me`);
  },

  updateMe(data: UpdateUserDto): Promise<UserProfile> {
    return apiClient.patch<UserProfile>(`${USERS}/me`, data);
  },

  deleteMe(): Promise<void> {
    return apiClient.delete<void>(`${USERS}/me`);
  },

  getStats(period: UsagePeriod): Promise<UsageStats> {
    return apiClient.get<UsageStats>(`${USERS}/me/stats?period=${period}`);
  },
};
