"use client";

import { ConfirmProvider } from "@/context/ConfirmContext";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <ConfirmProvider>{children}</ConfirmProvider>;
}
