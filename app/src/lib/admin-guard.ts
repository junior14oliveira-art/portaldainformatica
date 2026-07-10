import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

const ADMIN_ROLES = ["ADMIN", "MANAGER"] as const;

export async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/entrar?callbackURL=/admin");
  }

  const role = session.user.role as string | undefined;
  if (!role || !ADMIN_ROLES.includes(role as (typeof ADMIN_ROLES)[number])) {
    redirect("/");
  }

  return session;
}
