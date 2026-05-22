import { apiClient } from "@/lib/api/client";
import { API_CONFIG } from "@/lib/api/config";
import { ContactDto } from "@/types/contact.types";

const CONTACT = API_CONFIG.ENDPOINTS.CONTACT;

export const contactService = {
  submit(data: ContactDto): Promise<void> {
    return apiClient.post<void>(CONTACT, data);
  },
};
