import styles from "./StatCard.module.css";

type StatCardProps = {
  title: string;
  value: number;
  description?: string;
  variant?: "default" | "success" | "warning" | "danger";
};

export function StatCard({ title, value, description, variant = "default" }: StatCardProps) {
  return (
    <article className={`${styles.card} ${styles[variant]}`}>
      <p className={styles.title}>{title}</p>
      <p className={styles.value}>{value}</p>

      {description && <p className={styles.description}>{description}</p>}
    </article>
  );
}
