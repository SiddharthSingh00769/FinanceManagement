"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

// Categories considered "essential" — spending on these does NOT break the streak
const ESSENTIAL_CATEGORIES = new Set([
  "housing",
  "groceries",
  "utilities",
  "healthcare",
  "insurance",
  "bills",
  "education",
  "transportation",
]);

/**
 * Calculates the user's current "zero non-essential spend" streak.
 * Returns the number of consecutive days (counting backwards from yesterday)
 * where the user had $0 in non-essential expenses.
 * Today is excluded since the day isn't over yet.
 */
export async function getSpendingStreak() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) throw new Error("User not found");

    // Get the last 90 days of expense transactions
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const expenses = await db.transaction.findMany({
      where: {
        userId: user.id,
        type: "EXPENSE",
        date: { gte: ninetyDaysAgo },
      },
      select: {
        date: true,
        category: true,
      },
      orderBy: { date: "desc" },
    });

    // Build a Set of date strings (YYYY-MM-DD) that had non-essential spending
    const nonEssentialDays = new Set();
    for (const expense of expenses) {
      if (!ESSENTIAL_CATEGORIES.has(expense.category)) {
        const dateStr = expense.date.toISOString().split("T")[0];
        nonEssentialDays.add(dateStr);
      }
    }

    // Count streak backwards from yesterday
    let streak = 0;
    const checkDate = new Date();
    checkDate.setDate(checkDate.getDate() - 1); // Start from yesterday

    for (let i = 0; i < 90; i++) {
      const dateStr = checkDate.toISOString().split("T")[0];
      if (nonEssentialDays.has(dateStr)) {
        break; // Streak broken
      }
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }

    // Determine the longest streak in the last 90 days for context
    let longestStreak = 0;
    let currentRun = 0;
    const scanDate = new Date();
    scanDate.setDate(scanDate.getDate() - 1);

    for (let i = 0; i < 90; i++) {
      const dateStr = scanDate.toISOString().split("T")[0];
      if (nonEssentialDays.has(dateStr)) {
        longestStreak = Math.max(longestStreak, currentRun);
        currentRun = 0;
      } else {
        currentRun++;
      }
      scanDate.setDate(scanDate.getDate() - 1);
    }
    longestStreak = Math.max(longestStreak, currentRun);

    return {
      success: true,
      data: {
        currentStreak: streak,
        longestStreak: longestStreak,
      },
    };
  } catch (error) {
    console.error("Streak Error:", error);
    return { success: false, error: "Failed to calculate streak." };
  }
}
