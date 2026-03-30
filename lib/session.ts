import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase, isDatabaseConfigured } from "@/lib/mongoose";
import { UserModel } from "@/models/User";

export async function getCurrentSessionEmail() {
  const session = await getServerSession(authOptions);
  return session?.user?.email ?? null;
}

export async function requireCurrentUser() {
  const email = await getCurrentSessionEmail();

  if (!email) {
    return null;
  }

  if (!isDatabaseConfigured()) {
    throw new Error("Database not configured. Add MONGODB_URI to .env.local to use cart and orders.");
  }

  await connectToDatabase();

  const user = await UserModel.findOne({ email });
  return user;
}
