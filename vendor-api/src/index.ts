import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";
import { vendorRouter } from "./routes/vendor";
import { channelRouter } from "./routes/channel";
import hlsRouter from "./routes/hls";
import { serve } from "@hono/node-server";

const app = new OpenAPIHono();

// Middleware
app.use(
  "/*",
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://172.26.0.1:5173/",
    ],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: [
      "Content-Type",
      "Authorization",
      "x-hash",
      "x-hash-index",
      "x-smart-contract-address",
    ],
    exposeHeaders: ["Content-Length", "X-Request-Id"],
    maxAge: 3600,
    credentials: true,
  })
);

app.use("/*", secureHeaders());

// Routes
app.route("/api", vendorRouter);
app.route("/api", channelRouter);
app.route("/", hlsRouter);

// OpenAPI docs
app.doc("/docs", {
  openapi: "3.0.0",
  info: {
    title: "Vendor and Channel API",
    version: "1.0.0",
  },
});

app.get("/swagger", swaggerUI({ url: "/docs" }));

serve(app, (info) => {
  console.log(`Listening on http://localhost:${info.port}`); // Listening on http://localhost:3000
});
