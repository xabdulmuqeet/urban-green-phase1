import type { NextAuthOptions } from "next-auth";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { compare } from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import getMongoClientPromise from "@/lib/mongodb-client";
import { connectToDatabase, isDatabaseConfigured } from "@/lib/mongoose";
import { UserModel } from "@/models/User";

const authSecret =
  process.env.NEXTAUTH_SECRET ??
  (process.env.NODE_ENV !== "production" ? "urban-green-local-dev-secret" : undefined);
const smtpHost = process.env.EMAIL_SERVER_HOST;
const smtpPort = Number(process.env.EMAIL_SERVER_PORT ?? "587");
const smtpUser = process.env.EMAIL_SERVER_USER;
const smtpPassword = process.env.EMAIL_SERVER_PASSWORD;
const emailFrom = process.env.EMAIL_FROM;
const isEmailProviderConfigured = Boolean(smtpHost && smtpUser && smtpPassword && emailFrom);

if (!authSecret) {
  throw new Error("Missing NEXTAUTH_SECRET environment variable.");
}

export const authOptions: NextAuthOptions = {
  ...(isDatabaseConfigured()
    ? {
        adapter: MongoDBAdapter(getMongoClientPromise())
      }
    : {}),
  secret: authSecret,
  session: {
    strategy: "jwt"
  },
  providers: [
    ...(isDatabaseConfigured()
      ? [
          CredentialsProvider({
            id: "password-login",
            name: "Password Login",
            credentials: {
              email: { label: "Email", type: "email" },
              password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
              const email = credentials?.email?.trim().toLowerCase();
              const password = credentials?.password ?? "";

              if (!email || !password) {
                return null;
              }

              await connectToDatabase();
              const user = await UserModel.findOne({ email });

              if (!user?.passwordHash) {
                return null;
              }

              const isValid = await compare(password, user.passwordHash);

              if (!isValid) {
                return null;
              }

              return {
                id: String(user._id),
                email: user.email,
                name: user.name ?? email.split("@")[0]
              };
            }
          })
        ]
      : []),
    ...(process.env.NODE_ENV !== "production"
      ? [
          CredentialsProvider({
            id: "dev-email",
            name: "Dev Email",
            credentials: {
              email: { label: "Email", type: "email" }
            },
            async authorize(credentials) {
              const email = credentials?.email?.trim().toLowerCase();

              if (!email) {
                return null;
              }

              if (!isDatabaseConfigured()) {
                return {
                  id: email,
                  email,
                  name: email.split("@")[0]
                };
              }

              await connectToDatabase();
              let user = await UserModel.findOne({ email });

              if (!user) {
                user = await UserModel.create({ email });
              }

              return {
                id: String(user._id),
                email: user.email,
                name: user.name ?? email.split("@")[0]
              };
            }
          })
        ]
      : []),
    ...(isEmailProviderConfigured
      ? [
          EmailProvider({
            server: {
              host: smtpHost!,
              port: smtpPort,
              auth: {
                user: smtpUser!,
                pass: smtpPassword!
              }
            },
            from: emailFrom!
          })
        ]
      : [])
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        token.sub = user.id;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }

      return session;
    }
  }
};
