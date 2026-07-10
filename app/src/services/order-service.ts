import { PaymentMethod } from "@prisma/client";
import * as orderRepository from "@/repositories/order-repository";
import * as cartService from "@/services/cart-service";
import { getAddress } from "@/services/address-service";

export async function placeOrder(params: {
  userId: string;
  sessionId: string;
  addressId: string;
  shippingFee: number;
  paymentMethod: PaymentMethod;
}) {
  const address = await getAddress(params.addressId, params.userId);
  if (!address) {
    throw new Error("Endereço não encontrado.");
  }

  const cart = await cartService.getCart(params.sessionId);
  if (cart.items.length === 0) {
    throw new Error("Carrinho vazio.");
  }

  const subtotal = cart.subtotal;
  const total = subtotal + params.shippingFee;

  const order = await orderRepository.createOrder({
    userId: params.userId,
    addressId: params.addressId,
    subtotal,
    shippingFee: params.shippingFee,
    total,
    paymentMethod: params.paymentMethod,
    items: cart.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.unitPricePix ?? item.unitPrice,
      total: item.lineTotal,
    })),
  });

  await cartService.clearCart(params.sessionId);

  return order;
}

export function getOrder(id: string, userId: string) {
  return orderRepository.findOrderById(id, userId);
}

export function simulatePaymentApproval(orderId: string) {
  return orderRepository.approveOrderPayment(orderId);
}
