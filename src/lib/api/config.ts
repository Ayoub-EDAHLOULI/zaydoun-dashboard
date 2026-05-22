export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1",
  TIMEOUT: 30000,
  ENDPOINTS: {
    AUTH: "/auth",
    USERS: "/users",
    BOOKS: "/books",
    CONVERSATIONS: "/conversations",
    CONTACT: "/contact",
  },
};
