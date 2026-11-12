import styles from "./LoadingState.module.css";

type LoadingStateProps = {
  message?: string;
};

export function LoadingState({ message = "Завантаження..." }: LoadingStateProps) {
  return (
    <div className={styles.container} role="status" aria-live="polite">
      <span className={styles.spinner} />
      <h1 className={styles.message}>{message}</h1>
    </div>
  );
}
