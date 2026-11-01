"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MotionConfig } from "motion/react";
import { useState, type ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  const [client] = useState(() => new QueryClient({ defaultOptions: { mutations: { retry: false } } }));
  return (
    <QueryClientProvider client={client}>
      {/* Honors the OS "reduce motion" setting for every Motion animation. */}
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </QueryClientProvider>
  );
}
