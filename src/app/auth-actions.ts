"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { createSession } from "@/lib/auth";

export async function login(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "");

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    redirect(`/login?error=1${next ? `&next=${encodeURIComponent(next)}` : ""}`);
  }

  await createSession(user);
  if (next) redirect(next);
  if (user.role === "ADMIN") redirect("/admin");
  if (user.role === "AGENT") redirect("/agent");
  redirect("/");
}

export async function register(formData: FormData) {
  const type = String(formData.get("type") ?? "buyer");
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const phone = String(formData.get("phone") ?? "").trim() || null;

  if (!name || !email || password.length < 6) {
    redirect(`/register?type=${type}&error=invalid`);
  }
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    redirect(`/register?type=${type}&error=exists`);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const isAgent = type === "agent";
  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      phone,
      role: isAgent ? "AGENT" : "BUYER",
      agencyName: isAgent ? String(formData.get("agencyName") ?? "").trim() || null : null,
      agentStatus: isAgent ? "PENDING" : null,
      bio: isAgent ? String(formData.get("bio") ?? "").trim() || null : null,
    },
  });

  await createSession(user);
  redirect(isAgent ? "/agent" : "/");
}
