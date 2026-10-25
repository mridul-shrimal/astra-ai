import axios from "axios";
export type AppError = { message: string; retryable: boolean };
export function normalizeError(error: unknown): AppError { if (axios.isAxiosError(error)) { const message = error.response?.data?.message; return { message: typeof message === "string" ? message : "Unable to reach Astra AI. Please try again.", retryable: !error.response || error.response.status >= 500 }; } if (error instanceof Error) return { message: error.message, retryable: false }; return { message: "Something went wrong. Please try again.", retryable: false }; }
