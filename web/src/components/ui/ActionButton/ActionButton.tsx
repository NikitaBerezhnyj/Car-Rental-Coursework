"use client";

import { useConfirm } from "@/context/ConfirmContext";
import type { FormState } from "@/types/formState";
import { useTransition } from "react";

type ActionButtonProps = {
  id: number;
  label: string;
  className: string;
  action: (id: number) => Promise<FormState>;
  confirmMessage?: string;
  disabled?: boolean;
};

export function ActionButton({
  id,
  label,
  className,
  action,
  confirmMessage,
  disabled = false
}: ActionButtonProps) {
  const [pending, startTransition] = useTransition();
  const { showConfirm, showAlert } = useConfirm();

  async function handleClick() {
    if (confirmMessage && !(await showConfirm(confirmMessage))) return;

    startTransition(async () => {
      const { error } = await action(id);
      if (error) await showAlert(error);
    });
  }

  return (
    <button
      type="button"
      className={className}
      disabled={disabled || pending}
      onClick={handleClick}
    >
      {label}
    </button>
  );
}
