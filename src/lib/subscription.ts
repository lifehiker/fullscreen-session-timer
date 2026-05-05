import { db } from "@/lib/db";

export async function getUserSubscription(userId: string) {
  return db.subscription.findUnique({ where: { userId } });
}

export async function isProUser(userId: string): Promise<boolean> {
  const sub = await getUserSubscription(userId);
  if (!sub) return false;
  if (sub.status !== "active") return false;
  if (sub.currentPeriodEnd && sub.currentPeriodEnd < new Date()) return false;
  return true;
}

export async function getUserSessionCount(userId: string): Promise<number> {
  return db.timerSession.count({ where: { userId } });
}

export const FREE_SESSION_LIMIT = 3;
