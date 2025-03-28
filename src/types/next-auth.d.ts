// Type declarations for next-auth

import "next-auth";

declare module "next-auth" {
  interface User {

    accessToken?: string;
    url?: string;

  }

  interface Session {
    user: User & {
      accessToken?: string;
      refreshToken?: string;
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    accessToken?: string;
    refreshToken?: string;
  }
}