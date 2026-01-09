import { generalizeUrls } from "../utils";

export const API_BASE_URL = generalizeUrls(process.env.NEXT_PUBLIC_API_BASE_URL);
export const API_VERSION = generalizeUrls(process.env.NEXT_PUBLIC_API_VERSION);
export const API_URL = `${API_BASE_URL}/api/${API_VERSION}`;

export const ENDPOINTS = {
  auth: {
    signin: "/auth/user/login",
  },
  user: "/user",
  employee: "/employee",
};
