import { OpenAPIHono } from "@hono/zod-openapi";
import basicHlsRouter from "./basic";
import thumbnailRouter from "./thumbnail";
import qualityHlsRouter from "./quality";
import { type HLSErrorResponse } from "./utils";

export const hlsRouter = new OpenAPIHono();

// Register security scheme at the HLS router level
hlsRouter.openAPIRegistry.registerComponent("securitySchemes", "BearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "API Token", 
  description: "Enter your API token (required for POST, PUT, DELETE operations)"
});

// Mount all HLS routes - all routes are GET methods so no auth needed
hlsRouter.route("/", basicHlsRouter);
hlsRouter.route("/", thumbnailRouter);
hlsRouter.route("/", qualityHlsRouter);

// Error handling
hlsRouter.notFound((c) => {
  const errorResponse: HLSErrorResponse = {
    success: false,
    message: "Route not found",
  };
  return c.json(errorResponse, 404);
});

hlsRouter.onError((err, c) => {
  console.error("Server error:", err);
  const errorResponse: HLSErrorResponse = {
    success: false,
    message: "Internal server error",
  };
  return c.json(errorResponse, 500);
});

export default hlsRouter;
