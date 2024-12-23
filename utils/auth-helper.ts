import { auth } from "@clerk/nextjs/server";

type AuthCallback<T> = (userId: string) => Promise<T>;

type AuthResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export async function withAuth<T>(
  callback: AuthCallback<T>
): Promise<AuthResponse<T>> {
  try {
    const session = await auth();
    if (!session?.userId) {
      throw new Error("Unauthorized");
    }
    const result = await callback(session.userId);
    return { success: true, data: result };
  } catch (error) {
    console.error("Operation failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
