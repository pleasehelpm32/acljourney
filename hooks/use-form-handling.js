import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function useFormHandling(submitFn, successMessage, redirectPath) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (data) => {
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
        description: error.message || "Please try again.",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleSubmit,
    isSubmitting,
  };
}
