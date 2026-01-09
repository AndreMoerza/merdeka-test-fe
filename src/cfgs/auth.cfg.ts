import { authApi } from "@/lib/apis";
import { exactNetError } from "@/lib/utils";
import { NextAuthOptions, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

type UserCredResult = {
  id: string;
  email: string;
  image: string;
  name: string;
  token: string;
};

export const nextAuthConfig: NextAuthOptions = {
  cookies: {
    sessionToken: {
      name: "merdeka-admin-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { type: "text" },
        password: { type: "password" },
        deviceInfo: { type: "text" },
      },
      async authorize(credentials) {
        try {
          if (!credentials) {
            throw new Error("No credentials provided");
          }

          const deviceInfo = JSON.parse(String(credentials.deviceInfo));

          const loginResult = await authApi.login(
            credentials.email,
            credentials.password,
            deviceInfo,
          );

          return await Promise.resolve({
            id: loginResult.data.user.id,
            name: loginResult.data.user.name,
            email: credentials.email,
            image: loginResult.data?.user?.image,
            token: loginResult.data.token,
          } as UserCredResult);
        } catch (error) {
          throw new Error(`login:${exactNetError(error as Error)}`);
        }
      },
    }),
    CredentialsProvider({
      id: "register",
      name: "register",
      credentials: {
        name: { type: "text" },
        email: { type: "text" },
        phone: { type: "text" },
        password: { type: "password" },
        confirmPassword: { type: "password" },
        role: { type: "text" },
      },
      async authorize(credentials) {
        try {
          if (!credentials) {
            throw new Error("No credentials provided");
          }

          const role = JSON.parse(String(credentials.role));

          const registerUser = await authApi.registerUser({
            name: credentials.name,
            email: credentials.email,
            phone: credentials.phone,
            password: credentials.password,
            confirmPassword: credentials.confirmPassword,
            role,
          });

          return await Promise.resolve({
            id: registerUser.data.user.id,
            name: registerUser.data.user.name,
            email: credentials.email,
            image: registerUser.data?.user?.image,
            token: registerUser.data.token,
          } as UserCredResult);
        } catch (error) {
          throw new Error(`register:${exactNetError(error as Error)}`);
        }
      },
    }),
  ],
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  logger: {
    error: (...message) => console.error(`[NEXT-AUTH ERROR] :: `, ...message),
    warn: (...message) => console.warn(`[NEXT-AUTH WARNING] :: `, ...message),
    debug: (...message) => console.debug(`[NEXT-AUTH DEBUG] :: `, ...message),
  },
  callbacks: {
    session(params) {
      const token = params.token as UserCredResult;
      const session = params.session as Session & UserCredResult;

      if (token?.id) {
        session.token = token.token;
        session.user = {
          id: token.id,
          email: token.email,
          image: token.image,
          name: token.name,
          token: token.token,
        };
      }

      return session;
    },
    jwt(params) {
      const user = params.user as UserCredResult;
      if (user?.token) {
        params.token = user;
        params.token.sub = user.id;
      }

      return params.token;
    },
  },
};
