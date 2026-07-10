"use server";

import { revalidatePath } from "next/cache";
import type { UserRole } from "@prisma/client";
import { requireAdmin } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";

// Muda o papel (role) de um usuario — equivalente ao gerenciamento de
// "Usuarios" do WordPress. Apenas ADMIN pode promover/rebaixar outros
// usuarios, e ninguem pode alterar o proprio papel por aqui (evita se
// autorrebaixar por engano e ficar trancado fora do painel).
export async function changeUserRoleAction(userId: string, role: UserRole) {
  const session = await requireAdmin();

  if (session.user.role !== "ADMIN") {
    return { error: "Só administradores podem alterar papéis de usuário." };
  }
  if (session.user.id === userId) {
    return { error: "Você não pode alterar seu próprio papel por aqui." };
  }

  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/admin/usuarios");
}

export async function toggleUserActiveAction(userId: string, active: boolean) {
  const session = await requireAdmin();
  if (session.user.id === userId) {
    return { error: "Você não pode desativar sua própria conta." };
  }
  await prisma.user.update({ where: { id: userId }, data: { active } });
  revalidatePath("/admin/usuarios");
}
