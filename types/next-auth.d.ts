// types/next-auth.d.ts

import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      role: string; // <-- Ahora TypeScript sabe que 'role' es un string y existe.
    } & DefaultSession["user"];
  }

  interface User {
    role: string; // <-- También lo añadimos al tipo User base de NextAuth
  }
}