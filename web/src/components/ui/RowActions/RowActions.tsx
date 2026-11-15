"use client";

import styles from "./RowActions.module.css";
import { useConfirm } from "@/context/ConfirmContext";
import type { FormState } from "@/types/formState";
import Link from "next/link";
import { useTransition } from "react";

type RowActionsProps = {
  id: number;
  editHref?: string;
  deleteAction: (id: number) => Promise<FormState>;
};

export function RowActions({ id, editHref, deleteAction }: RowActionsProps) {
  const [pending, startTransition] = useTransition();
  const { showConfirm, showAlert } = useConfirm();

  async function handleDelete() {
    const confirmed = await showConfirm({
      title: "Видалення запису",
      message: "Видалити запис?",
      confirmText: "Видалити",
      danger: true
    });

    if (!confirmed) return;

    startTransition(async () => {
      const { error } = await deleteAction(id);
      if (error) await showAlert(error);
    });
  }

  return (
    <div className={styles.actions}>
      {editHref && (
        <Link href={editHref} className={styles.edit}>
          Редагувати
        </Link>
      )}

      <button type="button" className={styles.delete} disabled={pending} onClick={handleDelete}>
        Видалити
      </button>
    </div>
  );
}
