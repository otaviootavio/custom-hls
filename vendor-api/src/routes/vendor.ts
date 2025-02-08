import { OpenAPIHono } from "@hono/zod-openapi";
import { createRoute } from "@hono/zod-openapi";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { VendorService } from "../services/vendorService";
import { paginationSchema } from "../schemas/base";
import {
  createVendorSchema,
  updateVendorSchema,
  getVendorParamsSchema,
  vendorSuccessResponse,
  vendorListResponse,
  vendorErrorResponse,
  transformVendorResponse,
  type VendorSuccessResponse,
  type VendorListResponse,
  type VendorErrorResponse,
} from "../schemas/vendor";

const vendorService = new VendorService(prisma);
export const vendorRouter = new OpenAPIHono();

// Create vendor route
const createVendorRoute = createRoute({
  method: "post",
  path: "/vendors",
  request: {
    body: {
      content: {
        "application/json": {
          schema: createVendorSchema,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        "application/json": {
          schema: vendorSuccessResponse,
        },
      },
      description: "Vendor created successfully",
    },
    400: {
      content: {
        "application/json": {
          schema: vendorErrorResponse,
        },
      },
      description: "Invalid input data",
    },
    500: {
      content: {
        "application/json": {
          schema: vendorErrorResponse,
        },
      },
      description: "Internal server error",
    },
  },
});

// Get all vendors route
const getAllVendorsRoute = createRoute({
  method: "get",
  path: "/vendors",
  request: {
    query: paginationSchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: vendorListResponse,
        },
      },
      description: "List of all vendors",
    },
    400: {
      content: {
        "application/json": {
          schema: vendorErrorResponse,
        },
      },
      description: "Invalid pagination parameters",
    },
    500: {
      content: {
        "application/json": {
          schema: vendorErrorResponse,
        },
      },
      description: "Internal server error",
    },
  },
});

// Get vendor by ID route
const getVendorByIdRoute = createRoute({
  method: "get",
  path: "/vendors/{id}",
  request: {
    params: getVendorParamsSchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: vendorSuccessResponse,
        },
      },
      description: "Vendor retrieved successfully",
    },
    400: {
      content: {
        "application/json": {
          schema: vendorErrorResponse,
        },
      },
      description: "Invalid vendor ID",
    },
    404: {
      content: {
        "application/json": {
          schema: vendorErrorResponse,
        },
      },
      description: "Vendor not found",
    },
    500: {
      content: {
        "application/json": {
          schema: vendorErrorResponse,
        },
      },
      description: "Internal server error",
    },
  },
});

// Update vendor route
const updateVendorRoute = createRoute({
  method: "put",
  path: "/vendors/{id}",
  request: {
    params: getVendorParamsSchema,
    body: {
      content: {
        "application/json": {
          schema: updateVendorSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: vendorSuccessResponse,
        },
      },
      description: "Vendor updated successfully",
    },
    400: {
      content: {
        "application/json": {
          schema: vendorErrorResponse,
        },
      },
      description: "Invalid input data",
    },
    404: {
      content: {
        "application/json": {
          schema: vendorErrorResponse,
        },
      },
      description: "Vendor not found",
    },
    500: {
      content: {
        "application/json": {
          schema: vendorErrorResponse,
        },
      },
      description: "Internal server error",
    },
  },
});

// Route handlers
vendorRouter.openapi(createVendorRoute, async (c) => {
  try {
    const data = c.req.valid("json");
    const vendor = await vendorService.create(data);
    const transformedVendor = transformVendorResponse(vendor);

    const response: VendorSuccessResponse = {
      success: true,
      data: transformedVendor,
    };

    return c.json(response, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorResponse: VendorErrorResponse = {
        success: false,
        message: "Invalid input data",
      };
      return c.json(errorResponse, 400);
    }

    const errorResponse: VendorErrorResponse = {
      success: false,
      message: "Internal server error",
    };
    return c.json(errorResponse, 500);
  }
});

vendorRouter.openapi(getAllVendorsRoute, async (c) => {
  try {
    const { page, limit } = c.req.valid("query");
    const result = await vendorService.findAll(page, limit);

    const response: VendorListResponse = {
      success: true,
      data: result.vendors.map(transformVendorResponse),
      pagination: result.pagination,
    };

    return c.json(response, 200);
  } catch (error) {
    let errorResponse: VendorErrorResponse;

    if (error instanceof z.ZodError) {
      errorResponse = {
        success: false,
        message: "Invalid pagination parameters",
      };
      return c.json(errorResponse, 400);
    }

    errorResponse = {
      success: false,
      message: "Internal server error",
    };

    return c.json(errorResponse, 500);
  }
});

vendorRouter.openapi(getVendorByIdRoute, async (c) => {
  try {
    const { id } = c.req.valid("param");
    const vendor = await vendorService.findById(id);

    if (!vendor) {
      const errorResponse: VendorErrorResponse = {
        success: false,
        message: "Vendor not found",
      };
      return c.json(errorResponse, 404);
    }

    const transformedVendor = transformVendorResponse(vendor);
    const response: VendorSuccessResponse = {
      success: true,
      data: transformedVendor,
    };

    return c.json(response, 200);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorResponse: VendorErrorResponse = {
        success: false,
        message: "Invalid vendor ID",
      };
      return c.json(errorResponse, 400);
    }

    const errorResponse: VendorErrorResponse = {
      success: false,
      message: "Internal server error",
    };
    return c.json(errorResponse, 500);
  }
});

vendorRouter.openapi(updateVendorRoute, async (c) => {
  try {
    const { id } = c.req.valid("param");
    const data = c.req.valid("json");

    const vendor = await vendorService.update(id, data);

    const transformedVendor = transformVendorResponse(vendor);
    const response: VendorSuccessResponse = {
      success: true,
      data: transformedVendor,
    };

    return c.json(response, 200);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorResponse: VendorErrorResponse = {
        success: false,
        message: "Invalid input data",
      };
      return c.json(errorResponse, 400);
    }

    if (error instanceof Error && error.message.includes("not found")) {
      const errorResponse: VendorErrorResponse = {
        success: false,
        message: "Vendor not found",
      };
      return c.json(errorResponse, 404);
    }

    const errorResponse: VendorErrorResponse = {
      success: false,
      message: "Internal server error",
    };
    return c.json(errorResponse, 500);
  }
});

// Global error handling
vendorRouter.notFound((c) => {
  const errorResponse: VendorErrorResponse = {
    success: false,
    message: "Route not found",
  };
  return c.json(errorResponse, 404);
});

vendorRouter.onError((err, c) => {
  console.error("Server error:", err);
  const errorResponse: VendorErrorResponse = {
    success: false,
    message: "Internal server error",
  };
  return c.json(errorResponse, 500);
});

export default vendorRouter;
