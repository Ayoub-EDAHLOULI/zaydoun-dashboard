import { apiClient } from "@/lib/api/client";
import { API_CONFIG } from "@/lib/api/config";
import {
  UserProfile,
  UpdateUserDto,
  AdminUserRow,
  UsageStats,
  UsagePeriod,
} from "@/types/users.types";
import {
  CreateAdminUserFormData,
  EditAdminUserFormData,
} from "@/validations/users.validations";

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

  // ── Admin ──────────────────────────────────────────────────────────────
  listUsers(): Promise<AdminUserRow[]> {
    return apiClient.get<AdminUserRow[]>(`${USERS}`);
  },

  createUser(data: CreateAdminUserFormData): Promise<AdminUserRow> {
    return apiClient.post<AdminUserRow>(`${USERS}`, data);
  },

  updateUser(userId: string, data: EditAdminUserFormData): Promise<void> {
    return apiClient.patch<void>(`${USERS}/${userId}`, data);
  },

  updateRole(userId: string, role: "USER" | "ADMIN"): Promise<void> {
    return apiClient.patch<void>(`${USERS}/${userId}/role`, { role });
  },

  toggleActive(userId: string): Promise<{ isActive: boolean }> {
    return apiClient.patch<{ isActive: boolean }>(`${USERS}/${userId}/active`, {});
  },

  adminDeleteUser(userId: string): Promise<void> {
    return apiClient.delete<void>(`${USERS}/${userId}`);
  },
};
