import type { ReactNode } from "react";

interface AuthCardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
}

/** Centered narrow column used by every auth screen. */
export function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <div className="mx-auto w-full max-w-[460px] px-4 py-10 sm:py-16">
      {(title || subtitle) && (
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          {title && <h2 className="text-2xl font-bold">{title}</h2>}
          {subtitle && <p className="text-xs text-muted">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
}
