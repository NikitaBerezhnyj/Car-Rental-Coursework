"use client";

import styles from "./FormPage.module.css";
import Link from "next/link";
import { type FormEvent, type ReactNode, startTransition } from "react";

type FormPageProps = {
  title: string;
  subtitle: string;
  cancelHref: string;
  submitLabel: string;
  action: (formData: FormData) => void;
  pending: boolean;
  error: string | null;
  children: ReactNode;
};

export function FormPage({
  title,
  subtitle,
  cancelHref,
  submitLabel,
  action,
  pending,
  error,
  children
}: FormPageProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => action(formData));
  }

  return (
    <main className="page-container">
      <header>
        <h1 className="page-title">{title}</h1>
        <p className="page-subtitle">{subtitle}</p>
      </header>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.fields}>{children}</div>

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}

        <div className={styles.actions}>
          <Link href={cancelHref} className={`button-reset ${styles.cancel}`}>
            Скасувати
          </Link>

          <button type="submit" className="button-primary" disabled={pending}>
            {submitLabel}
          </button>
        </div>
      </form>
    </main>
  );
}
