import { OpenAPIHono } from "@hono/zod-openapi";
import { createRoute } from "@hono/zod-openapi";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { ChannelService } from "../services/channelService";
import { paginationSchema } from "../schemas/base";
import { BlockchainService } from '../services/blockchainService';
import {
  channelSchema,
  channelListResponse,
  channelErrorResponse,
  channelSuccessResponse,
  transformChannelResponse,
  type ChannelSuccessResponse,
  type ChannelListResponse,
  type ChannelErrorResponse,
  channelDeleteSuccessResponse,
} from "../schemas/channel";

const blockchainService = new BlockchainService();
const channelService = new ChannelService(prisma, blockchainService);
export const channelRouter = new OpenAPIHono();

// Create channel route
const createChannelRoute = createRoute({
  method: "post",
  path: "/channels",
  request: {
    body: {
      content: {
        "application/json": {
          schema: channelSchema,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        "application/json": {
          schema: channelSuccessResponse,
        },
      },
      description: "Channel created successfully",
    },
    400: {
      content: {
        "application/json": {
          schema: channelErrorResponse,
        },
      },
      description: "Invalid input data",
    },
    404: {
      content: {
        "application/json": {
          schema: channelErrorResponse,
        },
      },
      description: "Vendor not found",
    },
    500: {
      content: {
        "application/json": {
          schema: channelErrorResponse,
        },
      },
      description: "Internal server error",
    },
  },
});

// Get all channels route
const getAllChannelsRoute = createRoute({
  method: "get",
  path: "/channels",
  request: {
    query: paginationSchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: channelListResponse,
        },
      },
      description: "List of all channels",
    },
    400: {
      content: {
        "application/json": {
          schema: channelErrorResponse,
        },
      },
      description: "Invalid pagination parameters",
    },
    500: {
      content: {
        "application/json": {
          schema: channelErrorResponse,
        },
      },
      description: "Internal server error",
    },
  },
});

// Get channel by ID route
const getChannelByIdRoute = createRoute({
  method: "get",
  path: "/channels/{id}",
  request: {
    params: z.object({ id: z.string().uuid() }),
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: channelSuccessResponse,
        },
      },
      description: "Channel retrieved successfully",
    },
    400: {
      content: {
        "application/json": {
          schema: channelErrorResponse,
        },
      },
      description: "Invalid channel ID",
    },
    404: {
      content: {
        "application/json": {
          schema: channelErrorResponse,
        },
      },
      description: "Channel not found",
    },
    500: {
      content: {
        "application/json": {
          schema: channelErrorResponse,
        },
      },
      description: "Internal server error",
    },
  },
});

// Update channel route
const updateChannelRoute = createRoute({
  method: "put",
  path: "/channels/{id}",
  request: {
    params: z.object({ id: z.string().uuid() }),
    body: {
      content: {
        "application/json": {
          schema: channelSchema.partial(),
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: channelSuccessResponse,
        },
      },
      description: "Channel updated successfully",
    },
    400: {
      content: {
        "application/json": {
          schema: channelErrorResponse,
        },
      },
      description: "Invalid input data",
    },
    404: {
      content: {
        "application/json": {
          schema: channelErrorResponse,
        },
      },
      description: "Channel not found",
    },
    500: {
      content: {
        "application/json": {
          schema: channelErrorResponse,
        },
      },
      description: "Internal server error",
    },
  },
});

// Delete channel route
const deleteChannelRoute = createRoute({
  method: "delete",
  path: "/channels/{id}",
  request: {
    params: z.object({ id: z.string().uuid() }),
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: channelDeleteSuccessResponse,
        },
      },
      description: "Channel deleted successfully",
    },
    400: {
      content: {
        "application/json": {
          schema: channelErrorResponse,
        },
      },
      description: "Invalid channel ID",
    },
    404: {
      content: {
        "application/json": {
          schema: channelErrorResponse,
        },
      },
      description: "Channel not found",
    },
    500: {
      content: {
        "application/json": {
          schema: channelErrorResponse,
        },
      },
      description: "Internal server error",
    },
  },
});

// Close channel route
const closeChannelRoute = createRoute({
  method: "post",
  path: "/channels/{channelId}/close",
  request: {
    params: z.object({
      channelId: z.string().uuid(),
    }),
    body: {
      content: {
        "application/json": {
          schema: z.object({
            settlementTx: z
              .string()
              .optional()
              .describe("Optional settlement transaction hash"),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: channelSuccessResponse,
        },
      },
      description: "Channel closed successfully",
    },
    400: {
      content: {
        "application/json": {
          schema: channelErrorResponse,
        },
      },
      description: "Invalid input data",
    },
    404: {
      content: {
        "application/json": {
          schema: channelErrorResponse,
        },
      },
      description: "Channel not found",
    },
    409: {
      content: {
        "application/json": {
          schema: channelErrorResponse,
        },
      },
      description: "Channel is already closed",
    },
    500: {
      content: {
        "application/json": {
          schema: channelErrorResponse,
        },
      },
      description: "Internal server error",
    },
  },
});

// Get channels by vendor route
const getChannelsByVendorRoute = createRoute({
  method: "get",
  path: "/vendors/{vendorId}/channels",
  request: {
    params: z.object({ vendorId: z.string().uuid() }),
    query: paginationSchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: channelListResponse,
        },
      },
      description: "List of vendor channels",
    },
    400: {
      content: {
        "application/json": {
          schema: channelErrorResponse,
        },
      },
      description: "Invalid vendor ID or pagination parameters",
    },
    404: {
      content: {
        "application/json": {
          schema: channelErrorResponse,
        },
      },
      description: "Vendor not found",
    },
    500: {
      content: {
        "application/json": {
          schema: channelErrorResponse,
        },
      },
      description: "Internal server error",
    },
  },
});

// Route handlers
channelRouter.openapi(createChannelRoute, async (c) => {
  try {
    const data = c.req.valid("json");
    const channel = await channelService.create(data);
    const transformedChannel = transformChannelResponse(channel);

    const response: ChannelSuccessResponse = {
      success: true,
      data: transformedChannel,
    };

    return c.json(response, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorResponse: ChannelErrorResponse = {
        success: false,
        message: "Invalid input data",
      };
      return c.json(errorResponse, 400);
    }

    if (error instanceof Error && error.message === "Vendor not found") {
      const errorResponse: ChannelErrorResponse = {
        success: false,
        message: "Vendor not found",
      };
      return c.json(errorResponse, 404);
    }

    const errorResponse: ChannelErrorResponse = {
      success: false,
      message: "Internal server error",
    };
    return c.json(errorResponse, 500);
  }
});

channelRouter.openapi(getAllChannelsRoute, async (c) => {
  try {
    const { page, limit } = c.req.valid("query");
    const result = await channelService.findAll(page, limit);

    const response: ChannelListResponse = {
      success: true,
      data: result.channels.map(transformChannelResponse),
      pagination: result.pagination,
    };

    return c.json(response, 200);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorResponse: ChannelErrorResponse = {
        success: false,
        message: "Invalid pagination parameters",
      };
      return c.json(errorResponse, 400);
    }

    const errorResponse: ChannelErrorResponse = {
      success: false,
      message: "Internal server error",
    };
    return c.json(errorResponse, 500);
  }
});

channelRouter.openapi(getChannelByIdRoute, async (c) => {
  try {
    const { id } = c.req.valid("param");
    const channel = await channelService.findById(id);

    if (!channel) {
      const errorResponse: ChannelErrorResponse = {
        success: false,
        message: "Channel not found",
      };
      return c.json(errorResponse, 404);
    }

    const transformedChannel = transformChannelResponse(channel);
    const response: ChannelSuccessResponse = {
      success: true,
      data: transformedChannel,
    };

    return c.json(response, 200);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorResponse: ChannelErrorResponse = {
        success: false,
        message: "Invalid channel ID",
      };
      return c.json(errorResponse, 400);
    }

    const errorResponse: ChannelErrorResponse = {
      success: false,
      message: "Internal server error",
    };
    return c.json(errorResponse, 500);
  }
});

channelRouter.openapi(updateChannelRoute, async (c) => {
  try {
    const { id } = c.req.valid("param");
    const data = c.req.valid("json");

    const channel = await channelService.update(id, data);

    const transformedChannel = transformChannelResponse(channel);
    const response: ChannelSuccessResponse = {
      success: true,
      data: transformedChannel,
    };

    return c.json(response, 200);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorResponse: ChannelErrorResponse = {
        success: false,
        message: "Invalid input data",
      };
      return c.json(errorResponse, 400);
    }

    if (error instanceof Error && error.message === "Vendor not found") {
      const errorResponse: ChannelErrorResponse = {
        success: false,
        message: "Vendor not found",
      };
      return c.json(errorResponse, 404);
    }

    if (error instanceof Error && (error as any).code === "P2025") {
      const errorResponse: ChannelErrorResponse = {
        success: false,
        message: "Channel not found",
      };
      return c.json(errorResponse, 404);
    }

    const errorResponse: ChannelErrorResponse = {
      success: false,
      message: "Internal server error",
    };
    return c.json(errorResponse, 500);
  }
});

channelRouter.openapi(deleteChannelRoute, async (c) => {
  try {
    const { id } = c.req.valid("param");
    await channelService.delete(id);

    const response = channelDeleteSuccessResponse.parse({
      success: true as const,
      message: "Channel deleted successfully",
    });

    return c.json(response, 200);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorResponse: ChannelErrorResponse = {
        success: false,
        message: "Invalid channel ID",
      };
      return c.json(errorResponse, 400);
    }

    if (error instanceof Error && (error as any).code === "P2025") {
      const errorResponse: ChannelErrorResponse = {
        success: false,
        message: "Channel not found",
      };
      return c.json(errorResponse, 404);
    }

    const errorResponse: ChannelErrorResponse = {
      success: false,
      message: "Internal server error",
    };
    return c.json(errorResponse, 500);
  }
});

channelRouter.openapi(getChannelsByVendorRoute, async (c) => {
  try {
    const { vendorId } = c.req.valid("param");
    const { page, limit } = c.req.valid("query");

    const result = await channelService.findByVendor(vendorId, page, limit);

    const response: ChannelListResponse = {
      success: true,
      data: result.channels.map(transformChannelResponse),
      pagination: result.pagination,
    };

    return c.json(response, 200);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorResponse: ChannelErrorResponse = {
        success: false,
        message: "Invalid vendor ID or pagination parameters",
      };
      return c.json(errorResponse, 400);
    }

    if (error instanceof Error && error.message === "Vendor not found") {
      const errorResponse: ChannelErrorResponse = {
        success: false,
        message: "Vendor not found",
      };
      return c.json(errorResponse, 404);
    }

    const errorResponse: ChannelErrorResponse = {
      success: false,
      message: "Internal server error",
    };
    return c.json(errorResponse, 500);
  }
});

channelRouter.openapi(closeChannelRoute, async (c) => {
  try {
    const { channelId } = c.req.valid("param");
    const { settlementTx } = c.req.valid("json");

    // First check if channel exists and is not already closed
    const existingChannel = await channelService.findById(channelId);

    if (!existingChannel) {
      const errorResponse: ChannelErrorResponse = {
        success: false,
        message: "Channel not found",
      };
      return c.json(errorResponse, 404);
    }

    if (existingChannel.status === "CLOSED") {
      const errorResponse: ChannelErrorResponse = {
        success: false,
        message: "Channel is already closed",
      };
      return c.json(errorResponse, 409);
    }

    // Update channel with closed status and metadata
    const updatedChannel = await channelService.update(channelId, {
      status: "CLOSED",
      closedAt: new Date(),
      settlementTx: settlementTx,
    });

    const transformedChannel = transformChannelResponse(updatedChannel);
    const response: ChannelSuccessResponse = {
      success: true,
      data: transformedChannel,
    };

    return c.json(response, 200);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorResponse: ChannelErrorResponse = {
        success: false,
        message: "Invalid input data",
      };
      return c.json(errorResponse, 400);
    }

    if (error instanceof Error && (error as any).code === "P2025") {
      const errorResponse: ChannelErrorResponse = {
        success: false,
        message: "Channel not found",
      };
      return c.json(errorResponse, 404);
    }

    console.error("Error closing channel:", error);
    const errorResponse: ChannelErrorResponse = {
      success: false,
      message: "Internal server error",
    };
    return c.json(errorResponse, 500);
  }
});

// Global error handling
channelRouter.notFound((c) => {
  const errorResponse: ChannelErrorResponse = {
    success: false,
    message: "Route not found",
  };
  return c.json(errorResponse, 404);
});

channelRouter.onError((err, c) => {
  console.error("Server error:", err);
  const errorResponse: ChannelErrorResponse = {
    success: false,
    message: "Internal server error",
  };
  return c.json(errorResponse, 500);
});

export default channelRouter;
