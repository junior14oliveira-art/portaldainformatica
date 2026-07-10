import * as addressRepository from "@/repositories/address-repository";
import type { AddressInput } from "@/schemas/checkout-schema";

export function getUserAddresses(userId: string) {
  return addressRepository.findAddressesByUser(userId);
}

export function getAddress(id: string, userId: string) {
  return addressRepository.findAddressById(id, userId);
}

export function addAddress(userId: string, data: AddressInput) {
  return addressRepository.createAddress(userId, data);
}
