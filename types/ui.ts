import { ButtonHTMLAttributes, ReactNode } from "react";
import { VariantProps } from "class-variance-authority";
import { buttonVariants } from "@/components/ui/button";

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export interface FormSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export interface LoadingStateProps {
  text?: string;
}

export interface PageContainerProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}
