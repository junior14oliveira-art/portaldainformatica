/**
 * ⚠️ SIMULADO — ainda não integrado com a API real do Melhor Envio
 * (falta MELHOR_ENVIO_TOKEN em produção). Ver docs/13-roadmap.md Fase 7.
 * A estrutura de retorno já imita o formato de opções de frete de um
 * agregador real, para a troca futura ser só na implementação interna.
 */

export type ShippingOption = {
  id: string;
  carrier: string;
  service: string;
  price: number;
  estimatedDays: number;
};

const ORIGIN_STATE = "SP";

export function calculateShippingOptions(destinationState: string): ShippingOption[] {
  const sameState = destinationState.toUpperCase() === ORIGIN_STATE;

  return [
    {
      id: "economico",
      carrier: "Correios",
      service: "PAC",
      price: sameState ? 24.9 : 39.9,
      estimatedDays: sameState ? 3 : 7,
    },
    {
      id: "expresso",
      carrier: "Correios",
      service: "SEDEX",
      price: sameState ? 39.9 : 64.9,
      estimatedDays: sameState ? 1 : 3,
    },
  ];
}
