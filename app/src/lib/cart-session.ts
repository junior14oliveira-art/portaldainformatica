import { cookies } from "next/headers";
import { randomUUID } from "crypto";

const CART_SESSION_COOKIE = "cart_session_id";
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export async function getCartSessionId(): Promise<string> {
  const cookieStore = await cookies();
  const existing = cookieStore.get(CART_SESSION_COOKIE)?.value;
  if (existing) return existing;

  const sessionId = randomUUID();
  cookieStore.set(CART_SESSION_COOKIE, sessionId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: ONE_YEAR_SECONDS,
    path: "/",
  });
  return sessionId;
}

export async function peekCartSessionId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(CART_SESSION_COOKIE)?.value ?? null;
}
