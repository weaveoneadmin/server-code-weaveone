import { NextRequest } from "next/server";
import { AppError, ValidationError } from "./errors";
import { error } from "./response";
import { ZodError } from "zod";

type RouteHandler = (
  req: NextRequest,
  context?: { params: Promise<Record<string, string>> }
) => Promise<Response>;

/**
 * Wraps route handlers with consistent error handling and logging.
 */
export function withErrorHandling(handler: RouteHandler): RouteHandler {
  return async (req, context) => {
    try {
      return await handler(req, context);
    } catch (err) {
      if (err instanceof ZodError) {
        const details: Record<string, string[]> = {};
        err.issues.forEach((issue) => {
          const path = issue.path.join(".");
          if (!details[path]) details[path] = [];
          details[path].push(issue.message);
        });
        return error("请求参数验证失败", 400, "VALIDATION_ERROR", details);
      }

      if (err instanceof ValidationError) {
        return error(err.message, err.statusCode, err.code, err.details);
      }

      if (err instanceof AppError) {
        return error(err.message, err.statusCode, err.code);
      }

      console.error("[API Error]", {
        method: req.method,
        url: req.url,
        error: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
      });

      return error("服务器内部错误", 500, "INTERNAL_ERROR");
    }
  };
}
