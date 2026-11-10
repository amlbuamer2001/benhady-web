"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MotionConfig } from "motion/react";
import { useLocale } from "next-intl";
import { Direction } from "radix-ui";
import { useState, type ReactNode } from "react";
import { localeDirection, type Locale } from "@/i18n/routing";

export function Providers({ children }: { children: ReactNode }) {
  const [client] = useState(() => new QueryClient({ defaultOptions: { mutations: { retry: false } } }));
  const dir = localeDirection[useLocale() as Locale] ?? "ltr";
  return (
    <QueryClientProvider client={client}>
      {/* Radix popovers/selects read the reading direction from here (RTL in Arabic). */}
      <Direction.Provider dir={dir}>
        {/* Honors the OS "reduce motion" setting for every Motion animation. */}
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </Direction.Provider>
    </QueryClientProvider>
  );
}
