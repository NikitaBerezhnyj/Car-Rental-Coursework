import styles from "./ConfirmDialog.module.css";

type ConfirmDialogProps = {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  showCancel?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  title = "Підтвердження",
  message,
  confirmText = "Підтвердити",
  cancelText = "Скасувати",
  danger = false,
  showCancel = true,
  onConfirm,
  onCancel
}: ConfirmDialogProps) {
  return (
    <div className={styles.overlay} onMouseDown={onCancel}>
      <section
        className={styles.dialog}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-message"
        onMouseDown={event => event.stopPropagation()}
      >
        <h2 id="confirm-title">{title}</h2>
        <p id="confirm-message">{message}</p>

        <div className={styles.actions}>
          {showCancel && (
            <button type="button" className={styles.cancel} onClick={onCancel}>
              {cancelText}
            </button>
          )}

          <button
            type="button"
            className={danger ? styles.danger : styles.confirm}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </section>
    </div>
  );
}
