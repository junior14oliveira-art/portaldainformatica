"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { PaymentMethod } from "@prisma/client";
import { auth } from "@/lib/auth";
import { getCartSessionId } from "@/lib/cart-session";
import { addressSchema } from "@/schemas/checkout-schema";
import { addAddress } from "@/services/address-service";
import { placeOrder, simulatePaymentApproval } from "@/services/order-service";

async function requireUserId() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/entrar");
  }
  return session.user.id;
}

export async function addAddressAction(formData: FormData) {
  const userId = await requireUserId();

  const parsed = addressSchema.safeParse({
    zipCode: formData.get("zipCode"),
    street: formData.get("street"),
    number: formData.get("number"),
    complement: formData.get("complement") || undefined,
    neighborhood: formData.get("neighborhood"),
    city: formData.get("city"),
    state: formData.get("state"),
    reference: formData.get("reference") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const address = await addAddress(userId, parsed.data);
  revalidatePath("/checkout");
  return { address };
}

export async function placeOrderAction(params: {
  addressId: string;
  shippingFee: number;
  paymentMethod: PaymentMethod;
}) {
  const userId = await requireUserId();
  const sessionId = await getCartSessionId();

  const order = await placeOrder({
    userId,
    sessionId,
    addressId: params.addressId,
    shippingFee: params.shippingFee,
    paymentMethod: params.paymentMethod,
  });

  revalidatePath("/", "layout");
  redirect(`/pedido/${order.id}`);
}

export async function simulatePaymentAction(orderId: string) {
  await requireUserId();
  await simulatePaymentApproval(orderId);
  revalidatePath(`/pedido/${orderId}`);
}
