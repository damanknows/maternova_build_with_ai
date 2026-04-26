/**
 * Safely extracts a human-readable error message from an unknown error object.
 * Useful for handling exceptions in try/catch blocks where the error type is unknown.
 */
export function extractErrorMessage(error: unknown, fallback = "An unexpected error occurred"): string {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === "string") {
    return error;
  }
  
  if (error && typeof error === "object" && "message" in error && typeof (error as any).message === "string") {
    return (error as any).message;
  }
  
  return fallback;
}
