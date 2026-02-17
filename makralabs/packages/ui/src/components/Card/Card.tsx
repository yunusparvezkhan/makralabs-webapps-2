import type { PropsWithChildren } from "react";

export interface CardProps extends PropsWithChildren {
  className?: string;
}

export function Card({ className = "", children }: CardProps) {
  return <div className={`rounded-xl border border-gray-200 bg-white p-6 shadow-sm ${className}`.trim()}>{children}</div>;
}
