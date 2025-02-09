import { PrismaClient } from "@prisma/client";
import {
  transformPaymentResponse,
  type CreatePaymentInput,
  type PaymentSuccessResponse,
  type PaymentListResponse,
  type PaymentErrorResponse,
} from "../schemas/payment";

export class PaymentService {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreatePaymentInput) {
    try {
      // First verify the vendor exists
      const vendor = await this.prisma.vendor.findUnique({
        where: { id: data.vendorId },
      });

      if (!vendor) {
        throw new Error("Vendor not found");
      }

      // Verify the channel exists and belongs to the vendor
      const channel = await this.prisma.channel.findFirst({
        where: {
          vendorId: data.vendorId,
          contractAddress: data.contractAddress,
        },
      });

      if (!channel) {
        throw new Error("Channel not found or does not belong to the vendor");
      }

      // Verify hash hasn't been used before
      const existingPayment = await this.prisma.payment.findFirst({
        where: { xHash: data.xHash },
      });

      if (existingPayment) {
        throw new Error("Hash has already been used");
      }

      // Verify index is sequential
      if (data.index !== channel.lastIndex + 1) {
        throw new Error(
          `Invalid index. Expected ${channel.lastIndex + 1}, got ${data.index}`
        );
      }

      // Verify amount matches vendor's amountPerHash
      if (data.amount !== vendor.amountPerHash) {
        throw new Error(
          `Invalid amount. Expected ${vendor.amountPerHash}, got ${data.amount}`
        );
      }

      // Create payment and update channel in a transaction
      const [payment] = await this.prisma.$transaction([
        this.prisma.payment.create({
          data: {
            xHash: data.xHash,
            amount: data.amount,
            index: data.index,
            vendorId: data.vendorId,
            channelId: channel.id,
          },
          include: {
            vendor: true,
            channel: true,
          },
        }),
        this.prisma.channel.update({
          where: { id: channel.id },
          data: {
            lastIndex: data.index,
          },
        }),
      ]);

      return {
        success: true,
        data: transformPaymentResponse(payment),
      } as PaymentSuccessResponse;
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to create payment",
      } as PaymentErrorResponse;
    }
  }

  async findBySmartContract(
    smartContractAddress: string,
    page = 1,
    limit = 10
  ): Promise<PaymentListResponse | PaymentErrorResponse> {
    try {
      const skip = (page - 1) * limit;

      // First find the channel
      const channel = await this.prisma.channel.findFirst({
        where: { contractAddress: smartContractAddress },
      });

      if (!channel) {
        return {
          success: false,
          message: "Channel not found",
        } as PaymentErrorResponse;
      }

      const [total, payments] = await Promise.all([
        this.prisma.payment.count({
          where: { channelId: channel.id },
        }),
        this.prisma.payment.findMany({
          where: { channelId: channel.id },
          skip,
          take: limit,
          include: {
            vendor: true,
            channel: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        }),
      ]);

      const pages = Math.ceil(total / limit);

      return {
        success: true,
        data: payments.map(transformPaymentResponse),
        pagination: {
          total,
          page,
          limit,
          pages,
        },
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch payments",
      };
    }
  }

  // Keep other existing methods (findById, findAll, findByVendor, findByChannel, verifyHash)
  async findById(id: string) {
    try {
      const payment = await this.prisma.payment.findUnique({
        where: { id },
        include: {
          vendor: true,
          channel: true,
        },
      });

      if (!payment) {
        return {
          success: false,
          message: "Payment not found",
        } as PaymentErrorResponse;
      }

      return {
        success: true,
        data: transformPaymentResponse(payment),
      } as PaymentSuccessResponse;
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to find payment",
      } as PaymentErrorResponse;
    }
  }

  async findAll(
    page = 1,
    limit = 10
  ): Promise<PaymentListResponse | PaymentErrorResponse> {
    try {
      const skip = (page - 1) * limit;

      const [total, payments] = await Promise.all([
        this.prisma.payment.count(),
        this.prisma.payment.findMany({
          skip,
          take: limit,
          include: {
            vendor: true,
            channel: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        }),
      ]);

      const pages = Math.ceil(total / limit);

      return {
        success: true,
        data: payments.map(transformPaymentResponse),
        pagination: {
          total,
          page,
          limit,
          pages,
        },
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch payments",
      };
    }
  }

  async findByVendor(
    vendorId: string,
    page = 1,
    limit = 10
  ): Promise<PaymentListResponse | PaymentErrorResponse> {
    try {
      const skip = (page - 1) * limit;

      const [total, payments] = await Promise.all([
        this.prisma.payment.count({
          where: { vendorId },
        }),
        this.prisma.payment.findMany({
          where: { vendorId },
          skip,
          take: limit,
          include: {
            vendor: true,
            channel: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        }),
      ]);

      const pages = Math.ceil(total / limit);

      return {
        success: true,
        data: payments.map(transformPaymentResponse),
        pagination: {
          total,
          page,
          limit,
          pages,
        },
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch vendor payments",
      };
    }
  }

  async findByChannel(
    channelId: string,
    page = 1,
    limit = 10
  ): Promise<PaymentListResponse | PaymentErrorResponse> {
    try {
      const skip = (page - 1) * limit;

      const [total, payments] = await Promise.all([
        this.prisma.payment.count({
          where: { channelId },
        }),
        this.prisma.payment.findMany({
          where: { channelId },
          skip,
          take: limit,
          include: {
            vendor: true,
            channel: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        }),
      ]);

      const pages = Math.ceil(total / limit);

      return {
        success: true,
        data: payments.map(transformPaymentResponse),
        pagination: {
          total,
          page,
          limit,
          pages,
        },
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch channel payments",
      };
    }
  }

  async verifyHash(
    xHash: string,
    channelId: string
  ): Promise<PaymentSuccessResponse | PaymentErrorResponse> {
    try {
      const existingPayment = await this.prisma.payment.findFirst({
        where: { xHash },
      });

      if (existingPayment) {
        return {
          success: true,
          data: {
            isValid: false,
            message: "Hash has already been used",
          },
        };
      }

      const channel = await this.prisma.channel.findUnique({
        where: { id: channelId },
      });

      if (!channel) {
        return {
          success: true,
          data: {
            isValid: false,
            message: "Channel not found",
          },
        };
      }

      return {
        success: true,
        data: {
          isValid: true,
          message: "Hash is valid for use",
        },
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to verify hash",
      };
    }
  }
}
