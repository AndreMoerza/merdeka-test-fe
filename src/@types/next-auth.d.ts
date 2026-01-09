import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    expires: string;
    user: {
      email: string;
      name: string;
      token: string;
      id: string;
      image: string;
    };
    token: string;
    status: string;
  }
}
