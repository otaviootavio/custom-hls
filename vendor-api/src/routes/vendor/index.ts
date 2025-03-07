import { OpenAPIHono } from "@hono/zod-openapi";
import createVendorRouter from "./create";
import listVendorsRouter from "./list";
import getVendorRouter from "./get";
import updateVendorRouter from "./update";
import deleteVendorRouter from "./delete";

export const vendorRouter = new OpenAPIHono();

// Mount all vendor routes
vendorRouter.route("/", createVendorRouter);
vendorRouter.route("/", listVendorsRouter);
vendorRouter.route("/", getVendorRouter);
vendorRouter.route("/", updateVendorRouter);
vendorRouter.route("/", deleteVendorRouter);

// Global error handling
vendorRouter.notFound((c) => {
  return c.json(
    {
      success: false,
      message: "Route not found",
    },
    404
  );
});

vendorRouter.onError((err, c) => {
  console.error("Server error:", err);
  return c.json(
    {
      success: false,
      message: "Internal server error",
    },
    500
  );
});

export default vendorRouter;
