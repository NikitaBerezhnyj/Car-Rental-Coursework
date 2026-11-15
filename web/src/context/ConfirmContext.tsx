"use client";

import { ConfirmDialog } from "@/components/ui/ConfirmDialog/ConfirmDialog";
import { createContext, useCallback, useContext, useRef, useState } from "react";

type ConfirmOptions = {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  showCancel?: boolean;
};

type ConfirmContextType = {
  showConfirm: (options: ConfirmOptions | string) => Promise<boolean>;
  showAlert: (message: string) => Promise<void>;
};

const ConfirmContext = createContext<ConfirmContextType | null>(null);

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const resolver = useRef<((result: boolean) => void) | null>(null);

  const showConfirm = useCallback((value: ConfirmOptions | string): Promise<boolean> => {
    if (resolver.current) {
      return Promise.resolve(false);
    }

    const confirmOptions = typeof value === "string" ? { message: value } : value;

    setOptions(confirmOptions);

    return new Promise(resolve => {
      resolver.current = resolve;
    });
  }, []);

  const showAlert = useCallback(
    async (message: string) => {
      await showConfirm({
        title: "Повідомлення",
        message,
        confirmText: "OK",
        showCancel: false
      });
    },
    [showConfirm]
  );

  const handleClose = useCallback((result: boolean) => {
    resolver.current?.(result);
    resolver.current = null;
    setOptions(null);
  }, []);

  return (
    <ConfirmContext.Provider value={{ showConfirm, showAlert }}>
      {children}

      {options && (
        <ConfirmDialog
          {...options}
          onConfirm={() => handleClose(true)}
          onCancel={() => handleClose(false)}
        />
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const context = useContext(ConfirmContext);

  if (!context) {
    throw new Error("useConfirm must be used within ConfirmProvider");
  }

  return context;
}
