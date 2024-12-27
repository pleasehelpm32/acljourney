import { auth } from "@clerk/nextjs/server";
import { ActionResponse } from "@/types/actions";

type AuthCallback<T> = (userId: string) => Promise<ActionResponse<T>>;

export async function withAuth<T>(
  callback: AuthCallback<T>
): Promise<ActionResponse<T>> {
  try {
    const session = await auth();
    if (!session?.userId) {
      return { success: false, error: "Unauthorized" };
    }
    return await callback(session.userId);
  } catch (error) {
    console.error("Operation failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
