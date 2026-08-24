export function formatZar(amount: number) {
  return "R" + amount.toLocaleString("en-ZA").replace(/,/g, " ");
}

export function formatDate(d: Date | string) {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("en-ZA", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function checkOut(checkIn: Date, nights: number) {
  const d = new Date(checkIn);
  d.setUTCDate(d.getUTCDate() + nights);
  return d;
}

export const CATEGORIES = [
  { value: "BEACH", label: "Beach" },
  { value: "BUSH", label: "Bush & Safari" },
  { value: "MOUNTAIN", label: "Mountains & Country" },
] as const;

export function categoryLabel(value: string) {
  return CATEGORIES.find((c) => c.value === value)?.label ?? value;
}

export const PROVINCES = [
  "KwaZulu-Natal",
  "Western Cape",
  "Mpumalanga",
  "Limpopo",
  "North West",
  "Eastern Cape",
  "Free State",
  "Gauteng",
  "Northern Cape",
  "Mozambique",
];

export const SLEEPS_OPTIONS = [2, 4, 6, 8];

export function amenityList(amenities: string) {
  return amenities.split(",").map((a) => a.trim()).filter(Boolean);
}
