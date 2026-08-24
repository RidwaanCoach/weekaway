import { cookies } from "next/headers";
import crypto from "crypto";
import { redirect } from "next/navigation";

const COOKIE = "wa_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export type Session = {
  userId: string;
  role: "BUYER" | "AGENT" | "ADMIN";
  name: string;
  exp: number;
};

function secret() {
  return process.env.SESSION_SECRET || "weekaway-dev-secret";
}

function sign(data: string) {
  return crypto.createHmac("sha256", secret()).update(data).digest("base64url");
}

export async function createSession(user: { id: string; role: string; name: string }) {
  const payload: Session = {
    userId: user.id,
    role: user.role as Session["role"],
    name: user.name,
    exp: Date.now() + MAX_AGE * 1000,
  };
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const store = await cookies();
  store.set(COOKIE, `${data}.${sign(data)}`, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: MAX_AGE,
    path: "/",
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(COOKIE);
}

export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  const raw = store.get(COOKIE)?.value;
  if (!raw) return null;
  const [data, sig] = raw.split(".");
  if (!data || !sig) return null;
  const expected = sign(data);
  if (sig.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
    return null;
  }
  try {
    const session = JSON.parse(Buffer.from(data, "base64url").toString()) as Session;
    if (session.exp < Date.now()) return null;
    return session;
  } catch {
    return null;
  }
}

export async function requireRole(role: Session["role"]): Promise<Session> {
  const session = await getSession();
  if (!session) redirect(`/login?next=${role === "ADMIN" ? "/admin" : "/agent"}`);
  if (session.role !== role) redirect("/");
  return session;
}
