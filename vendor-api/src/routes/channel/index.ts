import { OpenAPIHono } from "@hono/zod-openapi";
import closeChannelRouter from "./close";
import createChannelRouter from "./create";
import getChannelRouter from "./get";
import updateChannelRouter from "./update";
import deleteChannelRouter from "./delete";
import listChannelsRouter from "./list";
import vendorChannelsRouter from "./vendor-channels";

export const channelRouter = new OpenAPIHono();

// Mount all channel routes
channelRouter.route("/", createChannelRouter);
channelRouter.route("/", getChannelRouter);
channelRouter.route("/", updateChannelRouter);
channelRouter.route("/", deleteChannelRouter);
channelRouter.route("/", listChannelsRouter);
channelRouter.route("/", vendorChannelsRouter);
channelRouter.route("/", closeChannelRouter);

// Global error handling
channelRouter.notFound((c) => {
  return c.json(
    {
      success: false,
      message: "Route not found",
    },
    404
  );
});

channelRouter.onError((err, c) => {
  console.error("Server error:", err);
  return c.json(
    {
      success: false,
      message: "Internal server error",
    },
    500
  );
});

export default channelRouter;
