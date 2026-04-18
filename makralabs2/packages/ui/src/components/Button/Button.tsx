import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-black text-white border-black",
  secondary: "bg-white text-black border-gray-300"
};

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium transition ${variantClasses[variant]} ${className}`.trim()}
      {...props}
    />
  );
}
