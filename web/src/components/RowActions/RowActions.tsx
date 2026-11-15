"use client";

import styles from "./RowActions.module.css";
import type { FormState } from "@/types/formState";
import { SquarePen, Trash } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";

type RowActionsProps = {
  id: number;
  editHref?: string;
  deleteAction: (id: number) => Promise<FormState>;
};

export function RowActions({ id, editHref, deleteAction }: RowActionsProps) {
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Видалити запис?")) return;

    startTransition(async () => {
      const { error } = await deleteAction(id);
      if (error) alert(error);
    });
  }

  return (
    <div className={styles.actions}>
      {editHref && (
        <Link href={editHref} className={styles.edit}>
          {/* Редагувати */}
          <SquarePen />
        </Link>
      )}

      <button type="button" className={styles.delete} disabled={pending} onClick={handleDelete}>
        {/* Видалити */}
        <Trash />
      </button>
    </div>
  );
}
