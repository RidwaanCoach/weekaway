"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";

async function requireApprovedAgent() {
  const session = await requireRole("AGENT");
  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user || user.agentStatus !== "APPROVED") redirect("/agent");
  return user;
}

export async function createListing(formData: FormData) {
  const agent = await requireApprovedAgent();
  const resortId = String(formData.get("resortId"));
  const checkIn = new Date(String(formData.get("checkIn")) + "T00:00:00Z");
  const nights = parseInt(String(formData.get("nights"))) || 7;
  const unitType = String(formData.get("unitType"));
  const sleeps = parseInt(String(formData.get("sleeps"))) || 4;
  const priceZar = parseInt(String(formData.get("priceZar")));
  const notes = String(formData.get("notes") ?? "").trim() || null;

  if (!resortId || isNaN(checkIn.getTime()) || !priceZar || priceZar < 100) {
    redirect("/agent/listings/new?error=1");
  }

  await prisma.listing.create({
    data: { resortId, agentId: agent.id, checkIn, nights, unitType, sleeps, priceZar, notes },
  });
  revalidatePath("/agent");
  redirect("/agent/listings?created=1");
}

export async function updateListing(formData: FormData) {
  const agent = await requireApprovedAgent();
  const id = String(formData.get("id"));
  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing || listing.agentId !== agent.id) redirect("/agent/listings");

  const checkIn = new Date(String(formData.get("checkIn")) + "T00:00:00Z");
  await prisma.listing.update({
    where: { id },
    data: {
      checkIn: isNaN(checkIn.getTime()) ? listing.checkIn : checkIn,
      nights: parseInt(String(formData.get("nights"))) || listing.nights,
      unitType: String(formData.get("unitType")) || listing.unitType,
      sleeps: parseInt(String(formData.get("sleeps"))) || listing.sleeps,
      priceZar: parseInt(String(formData.get("priceZar"))) || listing.priceZar,
      notes: String(formData.get("notes") ?? "").trim() || null,
    },
  });
  revalidatePath("/agent");
  redirect("/agent/listings?updated=1");
}

export async function setListingStatus(formData: FormData) {
  const agent = await requireApprovedAgent();
  const id = String(formData.get("id"));
  const status = String(formData.get("status"));
  if (!["LIVE", "SOLD", "REMOVED"].includes(status)) return;
  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing || listing.agentId !== agent.id) return;
  await prisma.listing.update({ where: { id }, data: { status } });
  revalidatePath("/agent/listings");
  revalidatePath("/agent");
}

export async function replyToEnquiry(formData: FormData) {
  const agent = await requireApprovedAgent();
  const id = String(formData.get("id"));
  const reply = String(formData.get("reply") ?? "").trim();
  const enquiry = await prisma.enquiry.findUnique({ where: { id }, include: { listing: true } });
  if (!enquiry || enquiry.listing.agentId !== agent.id || !reply) return;
  await prisma.enquiry.update({ where: { id }, data: { reply, status: "REPLIED" } });
  revalidatePath("/agent/enquiries");
}

export async function closeEnquiry(formData: FormData) {
  const agent = await requireApprovedAgent();
  const id = String(formData.get("id"));
  const enquiry = await prisma.enquiry.findUnique({ where: { id }, include: { listing: true } });
  if (!enquiry || enquiry.listing.agentId !== agent.id) return;
  await prisma.enquiry.update({ where: { id }, data: { status: "CLOSED" } });
  revalidatePath("/agent/enquiries");
}
