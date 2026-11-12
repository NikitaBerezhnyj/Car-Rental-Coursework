import styles from "./StatusBadge.module.css";

export type StatusBadgeVariant = "success" | "info" | "warning" | "danger" | "neutral";

type StatusBadgeProps = {
  label: string;
  variant: StatusBadgeVariant;
};

export function StatusBadge({ label, variant }: StatusBadgeProps) {
  return <span className={`${styles.badge} ${styles[variant]}`}>{label}</span>;
}
