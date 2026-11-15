import styles from "./FormField.module.css";
import type { ReactNode } from "react";

type FormFieldProps = {
  label: string;
  wide?: boolean;
  children: ReactNode;
};

export function FormField({ label, wide = false, children }: FormFieldProps) {
  return (
    <label className={`${styles.field} ${wide ? styles.wide : ""}`}>
      <span className={styles.label}>{label}</span>
      {children}
    </label>
  );
}
