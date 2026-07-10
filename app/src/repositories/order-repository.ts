import { prisma } from "@/lib/prisma";
import { PaymentMethod } from "@prisma/client";

type CreateOrderInput = {
  userId: string;
  addressId: string;
  subtotal: number;
  shippingFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
};

export function createOrder(input: CreateOrderInput) {
  return prisma.$transaction(async (tx) => {
    const count = await tx.order.count();
    const number = `PO-${String(count + 1).padStart(6, "0")}`;

    const order = await tx.order.create({
      data: {
        number,
        userId: input.userId,
        addressId: input.addressId,
        subtotal: input.subtotal,
        shippingFee: input.shippingFee,
        total: input.total,
        items: {
          create: input.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.total,
          })),
        },
        payments: {
          create: {
            method: input.paymentMethod,
            gateway: "mercado_pago",
          },
        },
      },
      include: { items: true, payments: true, address: true },
    });

    for (const item of input.items) {
      await tx.inventoryMovement.create({
        data: {
          productId: item.productId,
          type: "RESERVE",
          quantity: item.quantity,
          orderId: order.id,
          reason: "Reserva por novo pedido",
        },
      });
    }

    return order;
  });
}

export function findOrderById(id: string, userId: string) {
  return prisma.order.findFirst({
    where: { id, userId },
    include: {
      items: { include: { product: { include: { images: { where: { isMain: true } } } } } },
      address: true,
      payments: true,
    },
  });
}

export function approveOrderPayment(orderId: string) {
  return prisma.$transaction([
    prisma.order.update({
      where: { id: orderId },
      data: { status: "PAYMENT_APPROVED" },
    }),
    prisma.payment.updateMany({
      where: { orderId },
      data: { status: "APPROVED" },
    }),
  ]);
}
