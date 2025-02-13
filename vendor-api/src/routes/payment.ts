import { OpenAPIHono } from "@hono/zod-openapi";
import { createRoute } from "@hono/zod-openapi";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { PaymentService } from "../services/paymentService";
import { paginationSchema } from "../schemas/base";
import {
  createPaymentSchema,
  paymentSuccessResponse,
  paymentErrorResponse,
  paymentListResponse,
  transformPaymentResponse,
  type PaymentSuccessResponse,
  type PaymentListResponse,
  type PaymentErrorResponse,
  paymentDeleteSuccessResponse,
} from "../schemas/payment";
import { isAddress } from "viem";

const paymentService = new PaymentService(prisma);
export const paymentRouter = new OpenAPIHono();

// Create payment route
const createPaymentRoute = createRoute({
  method: "post",
  path: "/payments",
  request: {
    body: {
      content: {
        "application/json": {
          schema: createPaymentSchema,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        "application/json": {
          schema: paymentSuccessResponse,
        },
      },
      description: "Payment created successfully",
    },
    400: {
      content: {
        "application/json": {
          schema: paymentErrorResponse,
        },
      },
      description: "Invalid input data",
    },
    404: {
      content: {
        "application/json": {
          schema: paymentErrorResponse,
        },
      },
      description: "Vendor or channel not found",
    },
    500: {
      content: {
        "application/json": {
          schema: paymentErrorResponse,
        },
      },
      description: "Internal server error",
    },
  },
});

// Get all payments route
const getAllPaymentsRoute = createRoute({
  method: "get",
  path: "/payments",
  request: {
    query: paginationSchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: paymentListResponse,
        },
      },
      description: "List of all payments",
    },
    400: {
      content: {
        "application/json": {
          schema: paymentErrorResponse,
        },
      },
      description: "Invalid pagination parameters",
    },
    500: {
      content: {
        "application/json": {
          schema: paymentErrorResponse,
        },
      },
      description: "Internal server error",
    },
  },
});

// Get payment by ID route
const getPaymentByIdRoute = createRoute({
  method: "get",
  path: "/payments/{id}",
  request: {
    params: z.object({ id: z.string().uuid() }),
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: paymentSuccessResponse,
        },
      },
      description: "Payment retrieved successfully",
    },
    400: {
      content: {
        "application/json": {
          schema: paymentErrorResponse,
        },
      },
      description: "Invalid payment ID",
    },
    404: {
      content: {
        "application/json": {
          schema: paymentErrorResponse,
        },
      },
      description: "Payment not found",
    },
    500: {
      content: {
        "application/json": {
          schema: paymentErrorResponse,
        },
      },
      description: "Internal server error",
    },
  },
});

// Get payments by vendor route
const getPaymentsByVendorRoute = createRoute({
  method: "get",
  path: "/vendors/{vendorId}/payments",
  request: {
    params: z.object({ vendorId: z.string().uuid() }),
    query: paginationSchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: paymentListResponse,
        },
      },
      description: "List of vendor payments",
    },
    400: {
      content: {
        "application/json": {
          schema: paymentErrorResponse,
        },
      },
      description: "Invalid vendor ID or pagination parameters",
    },
    404: {
      content: {
        "application/json": {
          schema: paymentErrorResponse,
        },
      },
      description: "Vendor not found",
    },
    500: {
      content: {
        "application/json": {
          schema: paymentErrorResponse,
        },
      },
      description: "Internal server error",
    },
  },
});

// Get latest payment by smart contract address route
const getLatestPaymentByContractRoute = createRoute({
  method: "get",
  path: "/payments/contract/{smartContractAddress}/latest",
  request: {
    params: z.object({
      smartContractAddress: z.string(),
    }),
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: paymentSuccessResponse,
        },
      },
      description: "Latest payment retrieved successfully",
    },
    400: {
      content: {
        "application/json": {
          schema: paymentErrorResponse,
        },
      },
      description: "Invalid smart contract address",
    },
    404: {
      content: {
        "application/json": {
          schema: paymentErrorResponse,
        },
      },
      description: "No payment found for the given smart contract",
    },
    500: {
      content: {
        "application/json": {
          schema: paymentErrorResponse,
        },
      },
      description: "Internal server error",
    },
  },
});

// Get payments by channel route
const getPaymentsByChannelRoute = createRoute({
  method: "get",
  path: "/channels/{channelId}/payments",
  request: {
    params: z.object({ channelId: z.string().uuid() }),
    query: paginationSchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: paymentListResponse,
        },
      },
      description: "List of channel payments",
    },
    400: {
      content: {
        "application/json": {
          schema: paymentErrorResponse,
        },
      },
      description: "Invalid channel ID or pagination parameters",
    },
    404: {
      content: {
        "application/json": {
          schema: paymentErrorResponse,
        },
      },
      description: "Channel not found",
    },
    500: {
      content: {
        "application/json": {
          schema: paymentErrorResponse,
        },
      },
      description: "Internal server error",
    },
  },
});

// Verify hash route
const verifyHashRoute = createRoute({
  method: "post",
  path: "/payments/verify",
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            xHash: z.string(),
            channelId: z.string().uuid(),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: paymentSuccessResponse,
        },
      },
      description: "Hash verification result",
    },
    400: {
      content: {
        "application/json": {
          schema: paymentErrorResponse,
        },
      },
      description: "Invalid input data",
    },
    500: {
      content: {
        "application/json": {
          schema: paymentErrorResponse,
        },
      },
      description: "Internal server error",
    },
  },
});

// Route handlers
paymentRouter.openapi(createPaymentRoute, async (c) => {
  try {
    const data = c.req.valid("json");
    const payment = await paymentService.create(data);
    const transformedPayment = transformPaymentResponse(payment);

    const response: PaymentSuccessResponse = {
      success: true,
      data: transformedPayment,
    };

    return c.json(response, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorResponse: PaymentErrorResponse = {
        success: false,
        message: "Invalid input data",
      };
      return c.json(errorResponse, 400);
    }

    if (error instanceof Error) {
      if (
        error.message === "Vendor not found" ||
        error.message === "Channel not found"
      ) {
        const errorResponse: PaymentErrorResponse = {
          success: false,
          message: error.message,
        };
        return c.json(errorResponse, 404);
      }

      if (error.message === "Hash has already been used") {
        const errorResponse: PaymentErrorResponse = {
          success: false,
          message: error.message,
        };
        return c.json(errorResponse, 400);
      }
    }

    const errorResponse: PaymentErrorResponse = {
      success: false,
      message: "Internal server error",
    };
    return c.json(errorResponse, 500);
  }
});

paymentRouter.openapi(getAllPaymentsRoute, async (c) => {
  try {
    const { page, limit } = c.req.valid("query");
    const result = await paymentService.findAll(page, limit);

    const response: PaymentListResponse = {
      success: true,
      data: result.payments.map(transformPaymentResponse),
      pagination: result.pagination,
    };

    return c.json(response, 200);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorResponse: PaymentErrorResponse = {
        success: false,
        message: "Invalid pagination parameters",
      };
      return c.json(errorResponse, 400);
    }

    const errorResponse: PaymentErrorResponse = {
      success: false,
      message: "Internal server error",
    };
    return c.json(errorResponse, 500);
  }
});

paymentRouter.openapi(getPaymentByIdRoute, async (c) => {
  try {
    const { id } = c.req.valid("param");
    const payment = await paymentService.findById(id);

    if (!payment) {
      const errorResponse: PaymentErrorResponse = {
        success: false,
        message: "Payment not found",
      };
      return c.json(errorResponse, 404);
    }

    const transformedPayment = transformPaymentResponse(payment);
    const response: PaymentSuccessResponse = {
      success: true,
      data: transformedPayment,
    };

    return c.json(response, 200);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorResponse: PaymentErrorResponse = {
        success: false,
        message: "Invalid payment ID",
      };
      return c.json(errorResponse, 400);
    }

    const errorResponse: PaymentErrorResponse = {
      success: false,
      message: "Internal server error",
    };
    return c.json(errorResponse, 500);
  }
});

paymentRouter.openapi(getPaymentsByVendorRoute, async (c) => {
  try {
    const { vendorId } = c.req.valid("param");
    const { page, limit } = c.req.valid("query");

    const result = await paymentService.findByVendor(vendorId, page, limit);

    const response: PaymentListResponse = {
      success: true,
      data: result.payments.map(transformPaymentResponse),
      pagination: result.pagination,
    };

    return c.json(response, 200);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorResponse: PaymentErrorResponse = {
        success: false,
        message: "Invalid vendor ID or pagination parameters",
      };
      return c.json(errorResponse, 400);
    }

    const errorResponse: PaymentErrorResponse = {
      success: false,
      message: "Internal server error",
    };
    return c.json(errorResponse, 500);
  }
});

paymentRouter.openapi(getPaymentsByChannelRoute, async (c) => {
  try {
    const { channelId } = c.req.valid("param");
    const { page, limit } = c.req.valid("query");

    const result = await paymentService.findByChannel(channelId, page, limit);

    const response: PaymentListResponse = {
      success: true,
      data: result.payments.map(transformPaymentResponse),
      pagination: result.pagination,
    };

    return c.json(response, 200);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorResponse: PaymentErrorResponse = {
        success: false,
        message: "Invalid channel ID or pagination parameters",
      };
      return c.json(errorResponse, 400);
    }

    const errorResponse: PaymentErrorResponse = {
      success: false,
      message: "Internal server error",
    };
    return c.json(errorResponse, 500);
  }
});

paymentRouter.openapi(getLatestPaymentByContractRoute, async (c) => {
  try {
    const { smartContractAddress } = c.req.valid("param");

    if (!isAddress(smartContractAddress)) {
      const errorResponse: PaymentErrorResponse = {
        success: false,
        message: "Invalid smart contract address",
      };
      return c.json(errorResponse, 400);
    }

    const payment = await paymentService.getLatestPaymentBySmartContractAddress(
      smartContractAddress
    );

    if (!payment) {
      const errorResponse: PaymentErrorResponse = {
        success: false,
        message: "No payment found for the given smart contract",
      };
      return c.json(errorResponse, 404);
    }

    const transformedPayment = transformPaymentResponse(payment);
    const response: PaymentSuccessResponse = {
      success: true,
      data: transformedPayment,
    };

    return c.json(response, 200);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorResponse: PaymentErrorResponse = {
        success: false,
        message: "Invalid smart contract address",
      };
      return c.json(errorResponse, 400);
    }

    if (error instanceof Error && error.message === "Channel not found") {
      const errorResponse: PaymentErrorResponse = {
        success: false,
        message: "No payment found for the given smart contract",
      };
      return c.json(errorResponse, 404);
    }

    const errorResponse: PaymentErrorResponse = {
      success: false,
      message: "Internal server error",
    };
    return c.json(errorResponse, 500);
  }
});

paymentRouter.openapi(verifyHashRoute, async (c) => {
  try {
    const { xHash, channelId } = c.req.valid("json");
    const result = await paymentService.verifyHash(xHash, channelId);

    const response: PaymentSuccessResponse = {
      success: true,
      data: result,
    };

    return c.json(response, 200);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorResponse: PaymentErrorResponse = {
        success: false,
        message: "Invalid input data",
      };
      return c.json(errorResponse, 400);
    }

    const errorResponse: PaymentErrorResponse = {
      success: false,
      message: "Internal server error",
    };
    return c.json(errorResponse, 500);
  }
});

// Global error handling
paymentRouter.notFound((c) => {
  const errorResponse: PaymentErrorResponse = {
    success: false,
    message: "Route not found",
  };
  return c.json(errorResponse, 404);
});

paymentRouter.onError((err, c) => {
  console.error("Server error:", err);
  const errorResponse: PaymentErrorResponse = {
    success: false,
    message: "Internal server error",
  };
  return c.json(errorResponse, 500);
});

export default paymentRouter;
