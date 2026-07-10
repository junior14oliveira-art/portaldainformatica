"use client";

import { useState, useTransition } from "react";
import type { UserRole } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { changeUserRoleAction } from "@/app/admin/usuarios/actions";
import styles from "./OrderStatusForm.module.css";

const ROLES: { value: UserRole; label: string }[] = [
  { value: "ADMIN", label: "Administrador" },
  { value: "MANAGER", label: "Gerente" },
  { value: "FINANCE", label: "Financeiro" },
  { value: "MARKETING", label: "Marketing" },
  { value: "INVENTORY", label: "Estoque" },
  { value: "SUPPORT", label: "Atendimento" },
  { value: "CUSTOMER", label: "Cliente" },
];

export function UserRoleSelect({
  userId,
  currentRole,
  disabled,
}: {
  userId: string;
  currentRole: UserRole;
  disabled?: boolean;
}) {
  const [role, setRole] = useState(currentRole);
  const [isPending, startTransition] = useTransition();

  function handleChange(next: UserRole) {
    setRole(next);
    startTransition(async () => {
      await changeUserRoleAction(userId, next);
    });
  }

  return (
    <div className={styles.wrapper}>
      <select
        value={role}
        onChange={(e) => handleChange(e.target.value as UserRole)}
        disabled={disabled || isPending}
        className={styles.select}
      >
        {ROLES.map((r) => (
          <option key={r.value} value={r.value}>
            {r.label}
          </option>
        ))}
      </select>
      {isPending ? <Loader2 size={14} className="spin" aria-hidden /> : null}
    </div>
  );
}
