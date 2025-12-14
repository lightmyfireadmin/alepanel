import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "./db";
import { users } from "./db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

interface UserWithFlags {
  id: string;
  name: string;
  email: string;
  role: string;
  mustChangePassword: boolean;
  hasSeenOnboarding: boolean;
}


export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        const user = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1);

        if (user.length === 0) {
          return null;
        }

        // DEV AUTH BYPASS: In development mode, if password is "testing",
        // automatically log in if the email exists in the database
        if (process.env.NODE_ENV === "development" && password === "testing") {
          return {
            id: user[0].id,
            email: user[0].email,
            name: user[0].name,
            role: user[0].role,
            mustChangePassword: user[0].mustChangePassword,
            hasSeenOnboarding: user[0].hasSeenOnboarding,
          };
        }

        const isValid = await bcrypt.compare(password, user[0].passwordHash);

        if (!isValid) {
          return null;
        }

        return {
          id: user[0].id,
          email: user[0].email,
          name: user[0].name,
          role: user[0].role,
          mustChangePassword: user[0].mustChangePassword,
          hasSeenOnboarding: user[0].hasSeenOnboarding,
        };
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as unknown as UserWithFlags;
        token.id = u.id;
        token.role = u.role;
        token.mustChangePassword = u.mustChangePassword;
        token.hasSeenOnboarding = u.hasSeenOnboarding;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session.user as any).role = token.role as string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session.user as any).mustChangePassword = token.mustChangePassword as boolean;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session.user as any).hasSeenOnboarding = token.hasSeenOnboarding as boolean;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
});
