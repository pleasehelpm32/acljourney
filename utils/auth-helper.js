//utils/auth-helper.js
import { auth } from "@clerk/nextjs/server";

export async function withAuth(callback) {
  try {
    const session = await auth();
    if (!session?.userId) {
      throw new Error("Unauthorized");
    }
    return await callback(session.userId);
  } catch (error) {
    console.error("Operation failed:", error);
    return { success: false, error: error.message };
  }
}
