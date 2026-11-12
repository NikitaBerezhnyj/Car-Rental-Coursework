export type AppErrorCode = "VALIDATION" | "NOT_FOUND" | "CONFLICT";

export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: AppErrorCode,
  ) {
    super(message);
    this.name = "AppError";
  }
}
