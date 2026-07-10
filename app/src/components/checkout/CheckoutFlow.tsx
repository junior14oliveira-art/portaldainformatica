"use client";

import { useMemo, useState, useTransition } from "react";
import { Loader2, MapPin, Plus, Truck, Wallet } from "lucide-react";
import { PaymentMethod } from "@prisma/client";
import { calculateShippingOptions, type ShippingOption } from "@/services/shipping-service";
import { addAddressAction, placeOrderAction } from "@/app/checkout/actions";
import { addressSchema } from "@/schemas/checkout-schema";
import type { CartSummary } from "@/services/cart-service";
import styles from "./CheckoutFlow.module.css";

type Address = {
  id: string;
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
};

type CheckoutFlowProps = {
  addresses: Address[];
  cart: CartSummary;
};

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: "PIX", label: "PIX (aprovação imediata)" },
  { value: "CREDIT_CARD", label: "Cartão de crédito" },
  { value: "BOLETO", label: "Boleto bancário" },
];

export function CheckoutFlow({ addresses: initialAddresses, cart }: CheckoutFlowProps) {
  const [addresses, setAddresses] = useState(initialAddresses);
  const [selectedAddressId, setSelectedAddressId] = useState(
    initialAddresses.find((a) => a.isDefault)?.id ?? initialAddresses[0]?.id ?? ""
  );
  const [showNewAddress, setShowNewAddress] = useState(addresses.length === 0);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [selectedShippingId, setSelectedShippingId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("PIX");
  const [isPending, startTransition] = useTransition();

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId) ?? null;

  const shippingOptions: ShippingOption[] = useMemo(() => {
    if (!selectedAddress) return [];
    return calculateShippingOptions(selectedAddress.state);
  }, [selectedAddress]);

  const selectedShipping =
    shippingOptions.find((o) => o.id === selectedShippingId) ?? shippingOptions[0] ?? null;

  const shippingFee = selectedShipping?.price ?? 0;
  const total = cart.subtotal + shippingFee;

  async function handleAddAddress(formData: FormData) {
    setAddressError(null);

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
      setAddressError(parsed.error.issues[0]?.message ?? "Dados inválidos.");
      return;
    }

    const result = await addAddressAction(formData);
    if ("error" in result && result.error) {
      setAddressError(result.error);
      return;
    }
    if ("address" in result && result.address) {
      setAddresses((prev) => [result.address, ...prev]);
      setSelectedAddressId(result.address.id);
      setShowNewAddress(false);
    }
  }

  function handlePlaceOrder() {
    if (!selectedAddress || !selectedShipping) return;
    startTransition(async () => {
      await placeOrderAction({
        addressId: selectedAddress.id,
        shippingFee: selectedShipping.price,
        paymentMethod,
      });
    });
  }

  return (
    <div className={styles.layout}>
      <div className={styles.steps}>
        <section className={styles.step}>
          <h2>
            <MapPin size={18} strokeWidth={2} aria-hidden />
            Endereço de entrega
          </h2>

          {addresses.length > 0 && !showNewAddress ? (
            <div className={styles.addressList}>
              {addresses.map((address) => (
                <label key={address.id} className={styles.addressOption}>
                  <input
                    type="radio"
                    name="address"
                    checked={selectedAddressId === address.id}
                    onChange={() => setSelectedAddressId(address.id)}
                  />
                  <span>
                    {address.street}, {address.number}
                    {address.complement ? ` - ${address.complement}` : ""}
                    <br />
                    {address.neighborhood} — {address.city}/{address.state}
                    <br />
                    CEP {address.zipCode}
                  </span>
                </label>
              ))}
              <button
                type="button"
                className={styles.linkButton}
                onClick={() => setShowNewAddress(true)}
              >
                <Plus size={14} strokeWidth={2.25} aria-hidden />
                Usar outro endereço
              </button>
            </div>
          ) : (
            <form action={handleAddAddress} className={styles.addressForm}>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="zipCode">CEP</label>
                  <input id="zipCode" name="zipCode" placeholder="00000-000" required />
                </div>
                <div className={styles.field}>
                  <label htmlFor="state">Estado (UF)</label>
                  <input id="state" name="state" placeholder="SP" maxLength={2} required />
                </div>
              </div>
              <div className={styles.field}>
                <label htmlFor="street">Rua</label>
                <input id="street" name="street" required />
              </div>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="number">Número</label>
                  <input id="number" name="number" required />
                </div>
                <div className={styles.field}>
                  <label htmlFor="complement">Complemento</label>
                  <input id="complement" name="complement" />
                </div>
              </div>
              <div className={styles.field}>
                <label htmlFor="neighborhood">Bairro</label>
                <input id="neighborhood" name="neighborhood" required />
              </div>
              <div className={styles.field}>
                <label htmlFor="city">Cidade</label>
                <input id="city" name="city" required />
              </div>
              {addressError ? <p className={styles.error}>{addressError}</p> : null}
              <div className={styles.formActions}>
                {addresses.length > 0 ? (
                  <button
                    type="button"
                    className={styles.linkButton}
                    onClick={() => setShowNewAddress(false)}
                  >
                    Cancelar
                  </button>
                ) : null}
                <button type="submit" className={styles.primaryButton}>
                  Salvar endereço
                </button>
              </div>
            </form>
          )}
        </section>

        {selectedAddress ? (
          <section className={styles.step}>
            <h2>
              <Truck size={18} strokeWidth={2} aria-hidden />
              Frete
            </h2>
            <p className={styles.mockNotice}>
              Valores simulados — integração real com Melhor Envio pendente.
            </p>
            <div className={styles.shippingList}>
              {shippingOptions.map((option) => (
                <label key={option.id} className={styles.addressOption}>
                  <input
                    type="radio"
                    name="shipping"
                    checked={(selectedShippingId ?? shippingOptions[0]?.id) === option.id}
                    onChange={() => setSelectedShippingId(option.id)}
                  />
                  <span className={styles.shippingLine}>
                    <span>
                      {option.carrier} — {option.service}
                      <br />
                      <span className={styles.muted}>
                        até {option.estimatedDays} dia(s) útil(eis)
                      </span>
                    </span>
                    <strong>{currency.format(option.price)}</strong>
                  </span>
                </label>
              ))}
            </div>
          </section>
        ) : null}

        {selectedAddress && selectedShipping ? (
          <section className={styles.step}>
            <h2>
              <Wallet size={18} strokeWidth={2} aria-hidden />
              Pagamento
            </h2>
            <p className={styles.mockNotice}>
              Ambiente de simulação — integração real com Mercado Pago pendente.
            </p>
            <div className={styles.shippingList}>
              {PAYMENT_METHODS.map((method) => (
                <label key={method.value} className={styles.addressOption}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === method.value}
                    onChange={() => setPaymentMethod(method.value)}
                  />
                  <span>{method.label}</span>
                </label>
              ))}
            </div>
          </section>
        ) : null}
      </div>

      <aside className={styles.summary}>
        <h2>Resumo do pedido</h2>
        <ul className={styles.itemsList}>
          {cart.items.map((item) => (
            <li key={item.id}>
              <span>
                {item.quantity}x {item.name}
              </span>
              <span>{currency.format(item.lineTotal)}</span>
            </li>
          ))}
        </ul>
        <div className={styles.summaryRow}>
          <span>Subtotal</span>
          <span>{currency.format(cart.subtotal)}</span>
        </div>
        <div className={styles.summaryRow}>
          <span>Frete</span>
          <span>{selectedShipping ? currency.format(shippingFee) : "—"}</span>
        </div>
        <div className={styles.summaryTotal}>
          <span>Total</span>
          <span>{currency.format(total)}</span>
        </div>
        <button
          type="button"
          className={styles.placeOrderButton}
          disabled={!selectedAddress || !selectedShipping || isPending}
          onClick={handlePlaceOrder}
        >
          {isPending ? <Loader2 size={18} className="spin" aria-hidden /> : null}
          Confirmar pedido
        </button>
      </aside>
    </div>
  );
}
