import type { Response } from "express";

interface ApiResponseOptions<T> {
  res: Response;
  statusCode?: number;
  message?: string;
  data?: T;
}

export function apiResponse<T>({
  res,
  statusCode = 200,
  message = "Success",
  data,
}: ApiResponseOptions<T>) {
  return res.status(statusCode).json({
    success: statusCode >= 200 && statusCode < 300,
    message,
    data,
  });
}
