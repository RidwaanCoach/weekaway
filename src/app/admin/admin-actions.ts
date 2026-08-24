"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { seedDemoData } from "@/lib/demo-seed";

export async function resetDemoData() {
  await requireRole("ADMIN");
  await seedDemoData(prisma);
  revalidatePath("/", "layout");
  redirect("/admin?reset=1");
}

export async function setAgentStatus(formData: FormData) {
  await requireRole("ADMIN");
  const id = String(formData.get("id"));
  const status = String(formData.get("status"));
  if (!["APPROVED", "SUSPENDED", "PENDING"].includes(status)) return;
  await prisma.user.update({ where: { id }, data: { agentStatus: status } });
  // Hide a suspended agent's inventory from the marketplace
  if (status === "SUSPENDED") {
    await prisma.listing.updateMany({
      where: { agentId: id, status: "LIVE" },
      data: { status: "REMOVED" },
    });
  }
  revalidatePath("/admin/agents");
  revalidatePath("/admin");
}

export async function moderateListing(formData: FormData) {
  await requireRole("ADMIN");
  const id = String(formData.get("id"));
  const status = String(formData.get("status"));
  if (!["LIVE", "REMOVED"].includes(status)) return;
  await prisma.listing.update({ where: { id }, data: { status } });
  revalidatePath("/admin/listings");
}

export async function createResort(formData: FormData) {
  await requireRole("ADMIN");
  const name = String(formData.get("name") ?? "").trim();
  const town = String(formData.get("town") ?? "").trim();
  const province = String(formData.get("province") ?? "").trim();
  const category = String(formData.get("category") ?? "BEACH");
  const description = String(formData.get("description") ?? "").trim();
  const amenities = String(formData.get("amenities") ?? "").trim();

  if (!name || !town || !province || !description) {
    redirect("/admin/resorts?error=1");
  }
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const existing = await prisma.resort.findUnique({ where: { slug } });
  if (existing) redirect("/admin/resorts?error=exists");

  await prisma.resort.create({
    data: { slug, name, town, province, category, description, amenities },
  });
  revalidatePath("/admin/resorts");
  redirect("/admin/resorts?created=1");
}

export async function toggleFeatured(formData: FormData) {
  await requireRole("ADMIN");
  const id = String(formData.get("id"));
  const resort = await prisma.resort.findUnique({ where: { id } });
  if (!resort) return;
  await prisma.resort.update({ where: { id }, data: { featured: !resort.featured } });
  revalidatePath("/admin/resorts");
  revalidatePath("/");
}
