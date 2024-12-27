import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { ActionResponse } from "@/types/actions";

type SubmitFunction<T> = (data: any) => Promise<ActionResponse<T>>;

interface UseFormHandlingResult<T> {
  handleSubmit: (data: any) => Promise<ActionResponse<T> | undefined>;
  isSubmitting: boolean;
}

export function useFormHandling<T>(
  submitFn: SubmitFunction<T>,
  successMessage: string,
  redirectPath?: string
): UseFormHandlingResult<T> {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (
    data: any
  ): Promise<ActionResponse<T> | undefined> => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const result = await submitFn(data);

      if (result?.success) {
        toast({
          title: "Success!",
          description: successMessage,
        });

        if (redirectPath) {
          router.push(redirectPath);
        }

        return result;
      } else {
        throw new Error(result?.error || "Operation failed");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleSubmit,
    isSubmitting,
  };
}
