import { OpenAPIHono } from "@hono/zod-openapi";
import createPaymentRouter from "./create";
import listPaymentsRouter from "./list";
import getPaymentRouter from "./get";
import vendorPaymentsRouter from "./vendor-payments";
import channelPaymentsRouter from "./channel-payments";
import latestContractPaymentRouter from "./latest-contract";
import verifyHashRouter from "./verify";

export const paymentRouter = new OpenAPIHono();

// Mount all payment routes
paymentRouter.route("/", createPaymentRouter);
paymentRouter.route("/", listPaymentsRouter);
paymentRouter.route("/", getPaymentRouter);
paymentRouter.route("/", vendorPaymentsRouter);
paymentRouter.route("/", channelPaymentsRouter);
paymentRouter.route("/", latestContractPaymentRouter);
paymentRouter.route("/", verifyHashRouter);

// Global error handling
paymentRouter.notFound((c) => {
  return c.json({
    success: false,
    message: "Route not found",
  }, 404);
});

paymentRouter.onError((err, c) => {
  console.error("Server error:", err);
  return c.json({
    success: false,
    message: "Internal server error",
  }, 500);
});

export default paymentRouter;