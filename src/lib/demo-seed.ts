import type { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// Full demo dataset. Called by prisma/seed.ts (CLI) and by the admin
// "Reset demo data" action, so both always restore the identical state.

type ResortSeed = {
  slug: string;
  name: string;
  town: string;
  province: string;
  category: "BEACH" | "BUSH" | "MOUNTAIN";
  description: string;
  amenities: string;
  featured?: boolean;
};

const resorts: ResortSeed[] = [
  {
    slug: "cabana-beach",
    name: "Cabana Beach Resort",
    town: "Umhlanga Rocks",
    province: "KwaZulu-Natal",
    category: "BEACH",
    description:
      "One of South Africa's most loved family beach resorts, right on the Umhlanga promenade with direct beach access, multiple pools and the famous Cabana Beach boma nights.",
    amenities: "Direct beach access,Swimming pools,Kids club,Restaurants,Tennis courts,Self-catering units",
    featured: true,
  },
  {
    slug: "umhlanga-sands",
    name: "Umhlanga Sands Resort",
    town: "Umhlanga Rocks",
    province: "KwaZulu-Natal",
    category: "BEACH",
    description:
      "A landmark beachfront resort on the Umhlanga coastline with sea-facing units, heated pools and a short walk to Gateway and the village restaurants.",
    amenities: "Beachfront,Heated pool,Kids entertainment,Restaurant,Gym,Self-catering units",
    featured: true,
  },
  {
    slug: "breakers-resort",
    name: "Breakers Resort",
    town: "Umhlanga Rocks",
    province: "KwaZulu-Natal",
    category: "BEACH",
    description:
      "Set on the quieter northern end of Umhlanga overlooking the Hawaan forest and lagoon, Breakers offers a relaxed beach holiday with a superb pool deck.",
    amenities: "Beach access,Pool deck,Restaurant,Kids playground,Braai facilities",
  },
  {
    slug: "san-lameer",
    name: "San Lameer Resort",
    town: "Southbroom",
    province: "KwaZulu-Natal",
    category: "BEACH",
    description:
      "An exclusive estate on the KZN South Coast with a championship golf course, private beach lagoon and villas set in coastal forest.",
    amenities: "Golf course,Private beach,Villas,Restaurants,Tennis,Security estate",
    featured: true,
  },
  {
    slug: "margate-sands",
    name: "Margate Sands",
    town: "Margate",
    province: "KwaZulu-Natal",
    category: "BEACH",
    description:
      "Family self-catering resort a short stroll from Margate main beach, at the heart of the South Coast holiday strip.",
    amenities: "Swimming pool,Self-catering units,Trampolines,Games room,Braai facilities",
  },
  {
    slug: "uvongo-river-resort",
    name: "Uvongo River Resort",
    town: "Uvongo",
    province: "KwaZulu-Natal",
    category: "BEACH",
    description:
      "Tranquil resort on the banks of the Uvongo River, minutes from the beach and the waterfall lagoon, with canoeing and family entertainment.",
    amenities: "River frontage,Canoeing,Pool,Kids entertainment,Self-catering units",
  },
  {
    slug: "la-montagne",
    name: "La Montagne Resort",
    town: "Ballito",
    province: "KwaZulu-Natal",
    category: "BEACH",
    description:
      "Perched above Ballito's Willard Beach with sweeping sea views, tiered gardens and direct access to the tidal pool and promenade.",
    amenities: "Sea views,Beach access,Pool,Restaurant,Self-catering units",
  },
  {
    slug: "club-mykonos",
    name: "Club Mykonos",
    town: "Langebaan",
    province: "Western Cape",
    category: "BEACH",
    description:
      "Greek-island styled resort on the Langebaan lagoon, West Coast. Kaliva-style units, a private marina, casino and endless watersports.",
    amenities: "Lagoon beach,Marina,Casino,Watersports,Restaurants,Kids club",
    featured: true,
  },
  {
    slug: "the-dunes-resort",
    name: "The Dunes Resort",
    town: "Keurboomstrand",
    province: "Western Cape",
    category: "BEACH",
    description:
      "Contemporary beach resort on Keurbooms beach near Plettenberg Bay, with dune boardwalks, sea-facing pools and Garden Route scenery.",
    amenities: "Beachfront,Pools,Restaurant,Boardwalks,Self-catering units",
  },
  {
    slug: "pine-lake-marina",
    name: "Pine Lake Marina",
    town: "Sedgefield",
    province: "Western Cape",
    category: "BEACH",
    description:
      "Garden Route resort on the shores of Swartvlei lake near Sedgefield, with boating, fishing and forest walks between Knysna and Wilderness.",
    amenities: "Lakefront,Boating,Fishing,Pool,Kids entertainment,Self-catering chalets",
  },
  {
    slug: "san-martinho",
    name: "San Martinho Beach Club",
    town: "Bilene",
    province: "Mozambique",
    category: "BEACH",
    description:
      "Barefoot-luxury beach club on the Uembje lagoon at Bilene, Mozambique. Warm shallow waters, dhow trips and true tropical downtime.",
    amenities: "Lagoon beach,Watersports,Restaurant,Bar,Self-catering chalets",
  },
  {
    slug: "kruger-park-lodge",
    name: "Kruger Park Lodge",
    town: "Hazyview",
    province: "Mpumalanga",
    category: "BUSH",
    description:
      "Iconic lowveld resort on the banks of the Sabie River outside Hazyview, with a golf course, resident hippos and the Kruger's Phabeni gate minutes away.",
    amenities: "Golf course,River frontage,Pools,Game drives,Restaurant,Self-catering chalets",
    featured: true,
  },
  {
    slug: "sabi-river-sun",
    name: "Sabi River Sun Resort",
    town: "Hazyview",
    province: "Mpumalanga",
    category: "BUSH",
    description:
      "Resort and country club on the Sabie River with a lush golf course, abundant birdlife and easy access to the Panorama Route and Kruger.",
    amenities: "Golf course,Pools,Restaurant,Bowls,Kids club,River views",
  },
  {
    slug: "ngwenya-lodge",
    name: "Ngwenya Lodge",
    town: "Komatipoort",
    province: "Mpumalanga",
    category: "BUSH",
    description:
      "On the southern banks of the Crocodile River overlooking the Kruger National Park itself - game viewing from your patio without entering the park.",
    amenities: "Kruger views,Game viewing decks,Pools,Restaurant,Fishing,Self-catering chalets",
    featured: true,
  },
  {
    slug: "sudwala-lodge",
    name: "Sudwala Lodge",
    town: "Mbombela",
    province: "Mpumalanga",
    category: "BUSH",
    description:
      "Riverside lowveld lodge at the foot of the Drakensberg escarpment, next to the famous Sudwala Caves and Dinosaur Park.",
    amenities: "River frontage,Pools,Restaurant,Caves nearby,Self-catering units",
  },
  {
    slug: "badplaas-forever",
    name: "Forever Resort Badplaas",
    town: "Badplaas",
    province: "Mpumalanga",
    category: "BUSH",
    description:
      "Classic hot-springs family resort beneath the Hlumuhlumu mountains, with mineral pools, a spa and hectares of lawns for kids.",
    amenities: "Hot springs,Indoor pools,Spa,Supertube,Game drives,Self-catering chalets",
  },
  {
    slug: "dikhololo",
    name: "Dikhololo Game Reserve",
    town: "Brits",
    province: "North West",
    category: "BUSH",
    description:
      "Malaria-free bushveld reserve under an hour from Pretoria, with roaming game, bush walks and a full family entertainment programme.",
    amenities: "Game reserve,Pools,Bush walks,Kids entertainment,Restaurant,Self-catering chalets",
    featured: true,
  },
  {
    slug: "kwa-maritane",
    name: "Kwa Maritane Bush Lodge",
    town: "Pilanesberg",
    province: "North West",
    category: "BUSH",
    description:
      "Upmarket bush lodge inside the malaria-free Pilanesberg National Park, famous for its sunken hide at the waterhole and Big Five game drives.",
    amenities: "Big Five reserve,Waterhole hide,Game drives,Pools,Restaurant,Spa",
  },
  {
    slug: "bakubung",
    name: "Bakubung Bush Lodge",
    town: "Pilanesberg",
    province: "North West",
    category: "BUSH",
    description:
      "Bush lodge at the 'Place of the Hippo' inside Pilanesberg National Park, with a resident hippo pod at the waterhole below the restaurant deck.",
    amenities: "Big Five reserve,Hippo waterhole,Game drives,Pool,Restaurant,Spa",
  },
  {
    slug: "mabalingwe",
    name: "Mabalingwe Nature Reserve",
    town: "Bela-Bela",
    province: "Limpopo",
    category: "BUSH",
    description:
      "Sprawling bushveld reserve near Bela-Bela with lion camp, game drives, and family chalets spread across koppies and valleys.",
    amenities: "Game reserve,Game drives,Pools,Restaurant,Mini golf,Self-catering chalets",
  },
  {
    slug: "mount-amanzi",
    name: "Mount Amanzi Lodge",
    town: "Hartbeespoort",
    province: "North West",
    category: "MOUNTAIN",
    description:
      "Riverside resort in the Magaliesberg on the Crocodile River, under an hour from Joburg and Pretoria - the classic quick family breakaway.",
    amenities: "River frontage,Pools,Putt-putt,Kids entertainment,Restaurant,Self-catering chalets",
  },
  {
    slug: "drakensberg-sun",
    name: "Drakensberg Sun Resort",
    town: "Winterton",
    province: "KwaZulu-Natal",
    category: "MOUNTAIN",
    description:
      "Mountain resort on the shores of a trout lake beneath Cathkin Peak in the Central Drakensberg, with sweeping berg views from every unit.",
    amenities: "Mountain views,Lake,Heated pool,Restaurant,Hiking trails,Horse riding",
    featured: true,
  },
  {
    slug: "champagne-sports",
    name: "Champagne Sports Resort",
    town: "Winterton",
    province: "KwaZulu-Natal",
    category: "MOUNTAIN",
    description:
      "The Drakensberg's premier sports and leisure resort beneath Champagne Castle, with a top-rated golf course and full conference and family facilities.",
    amenities: "Golf course,Tennis,Bowls,Pools,Restaurants,Mountain hikes",
  },
  {
    slug: "alpine-heath",
    name: "Alpine Heath Resort",
    town: "Bergville",
    province: "KwaZulu-Natal",
    category: "MOUNTAIN",
    description:
      "All-chalet village resort in the Northern Drakensberg near the Amphitheatre, ideal for hiking families and winter fireside escapes.",
    amenities: "Mountain views,Chalets,Pools,Kids club,Restaurant,Hiking trails",
  },
  {
    slug: "fairways-drakensberg",
    name: "Fairways Drakensberg",
    town: "Drakensberg Gardens",
    province: "KwaZulu-Natal",
    category: "MOUNTAIN",
    description:
      "Gracious resort in the Southern Drakensberg's Garden Castle valley, beside the country club golf course with berg peaks all around.",
    amenities: "Golf nearby,Mountain views,Pool,Restaurant,Trout fishing,Self-catering units",
  },
  {
    slug: "goudini-spa",
    name: "Goudini Spa",
    town: "Rawsonville",
    province: "Western Cape",
    category: "MOUNTAIN",
    description:
      "Natural hot-spring resort in the Slanghoek Valley winelands, ringed by the Du Toitskloof mountains - mineral pools, vineyards and mountain air.",
    amenities: "Hot springs,Indoor and outdoor pools,Spa,Restaurant,Winelands,Self-catering chalets",
  },
];

const agents = [
  {
    email: "sharon@coastalweeks.co.za",
    name: "Sharon Naidoo",
    agencyName: "Coastal Weeks Trading",
    phone: "082 555 1010",
    agentStatus: "APPROVED",
    bio: "Specialists in KZN beachfront weeks for over 12 years. Cabana Beach, Umhlanga Sands and the South Coast are our home turf.",
  },
  {
    email: "pieter@bushveldbreaks.co.za",
    name: "Pieter van der Merwe",
    agencyName: "Bushveld Breaks",
    phone: "083 555 2020",
    agentStatus: "APPROVED",
    bio: "Bushveld and Kruger-area specialists. If it has a waterhole, we can get you a week there.",
  },
  {
    email: "fatima@holidayhub.co.za",
    name: "Fatima Khan",
    agencyName: "Holiday Hub SA",
    phone: "084 555 3030",
    agentStatus: "APPROVED",
    bio: "Nationwide inventory across beach, bush and berg. Family-run agency since 2009.",
  },
  {
    email: "thabo@sunseeker.co.za",
    name: "Thabo Mokoena",
    agencyName: "SunSeeker Getaways",
    phone: "081 555 4040",
    agentStatus: "PENDING",
    bio: "New agency focused on affordable school-holiday weeks for Gauteng families.",
  },
];

// Deterministic pseudo-random so every reset produces the identical dataset
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Fridays make natural check-in days for timeshare weeks
function upcomingFridays(count: number, startOffsetDays: number): Date[] {
  const out: Date[] = [];
  const d = new Date("2026-07-08T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + startOffsetDays);
  while (d.getUTCDay() !== 5) d.setUTCDate(d.getUTCDate() + 1);
  for (let i = 0; i < count; i++) {
    out.push(new Date(d));
    d.setUTCDate(d.getUTCDate() + 7);
  }
  return out;
}

const unitTypes: { unitType: string; sleeps: number; base: number }[] = [
  { unitType: "Studio", sleeps: 2, base: 6500 },
  { unitType: "1 Bedroom", sleeps: 4, base: 9500 },
  { unitType: "2 Bedroom", sleeps: 6, base: 13500 },
  { unitType: "3 Bedroom", sleeps: 8, base: 18500 },
];

export async function seedDemoData(prisma: PrismaClient) {
  const rand = mulberry32(20260708);
  const pick = <T,>(arr: T[]): T => arr[Math.floor(rand() * arr.length)];

  await prisma.enquiry.deleteMany();
  await prisma.review.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.resort.deleteMany();
  await prisma.user.deleteMany();

  const adminHash = await bcrypt.hash("admin123", 10);
  const agentHash = await bcrypt.hash("agent123", 10);
  const buyerHash = await bcrypt.hash("buyer123", 10);

  await prisma.user.create({
    data: {
      email: "admin@weekaway.co.za",
      passwordHash: adminHash,
      name: "WeekAway Admin",
      role: "ADMIN",
    },
  });

  const buyer = await prisma.user.create({
    data: {
      email: "demo@buyer.co.za",
      passwordHash: buyerHash,
      name: "Demo Buyer",
      role: "BUYER",
    },
  });

  const agentRecords = [];
  for (const a of agents) {
    agentRecords.push(
      await prisma.user.create({
        data: { ...a, passwordHash: agentHash, role: "AGENT" },
      })
    );
  }
  const approvedAgents = agentRecords.filter((a) => a.agentStatus === "APPROVED");

  const resortRecords = [];
  for (const r of resorts) {
    resortRecords.push(await prisma.resort.create({ data: { ...r, featured: r.featured ?? false } }));
  }

  const reviewSeeds = [
    { rating: 5, authorName: "Megan P.", comment: "Booked Cabana Beach for December, seamless from start to finish. Week was confirmed in my name within a day." },
    { rating: 4, authorName: "Sipho D.", comment: "Good price, quick responses. Would use again." },
    { rating: 5, authorName: "Anthea R.", comment: "Got us Ngwenya in peak season when everyone else said impossible." },
    { rating: 5, authorName: "Johan K.", comment: "Professional and honest about what was available. No pressure." },
    { rating: 4, authorName: "Priya M.", comment: "Smooth transaction, resort confirmed the booking before I paid the balance." },
    { rating: 5, authorName: "Craig B.", comment: "Third year running we book our berg week through them." },
  ];
  for (const agent of approvedAgents) {
    const n = 2 + Math.floor(rand() * 3);
    for (let i = 0; i < n; i++) {
      const rv = pick(reviewSeeds);
      await prisma.review.create({ data: { agentId: agent.id, ...rv } });
    }
  }

  // Listings: spread of upcoming weeks incl. Dec school holidays; a few duplicate
  // resort+week pairs from different agents at different prices to show comparison
  const fridays = upcomingFridays(26, 14);
  const decemberFridays = fridays.filter((f) => f.getUTCMonth() === 11);
  let created = 0;

  for (const resort of resortRecords) {
    const numListings = 2 + Math.floor(rand() * 3);
    for (let i = 0; i < numListings; i++) {
      const unit = pick(unitTypes);
      const week = rand() < 0.3 && decemberFridays.length ? pick(decemberFridays) : pick(fridays);
      const isPeak = week.getUTCMonth() === 11 || week.getUTCMonth() === 3;
      const premium = resort.featured ? 1.25 : 1.0;
      const seasonal = isPeak ? 1.6 : 0.85 + rand() * 0.4;
      const price = Math.round((unit.base * premium * seasonal) / 100) * 100;
      const agent = pick(approvedAgents);
      await prisma.listing.create({
        data: {
          resortId: resort.id,
          agentId: agent.id,
          checkIn: week,
          nights: 7,
          unitType: unit.unitType,
          sleeps: unit.sleeps,
          priceZar: price,
          status: rand() < 0.12 ? "SOLD" : "LIVE",
          views: Math.floor(rand() * 400),
          notes: isPeak ? "Peak season week - these go fast." : null,
        },
      });
      created++;

      if (rand() < 0.25) {
        const other = pick(approvedAgents.filter((a) => a.id !== agent.id));
        await prisma.listing.create({
          data: {
            resortId: resort.id,
            agentId: other.id,
            checkIn: week,
            nights: 7,
            unitType: unit.unitType,
            sleeps: unit.sleeps,
            priceZar: Math.round((price * (0.88 + rand() * 0.24)) / 100) * 100,
            status: "LIVE",
            views: Math.floor(rand() * 300),
          },
        });
        created++;
      }
    }
  }

  const someListings = await prisma.listing.findMany({ where: { status: "LIVE" }, take: 8 });
  const enquiryMsgs = [
    "Hi, is this week still available? We are a family of 4 with two small kids.",
    "Good day. Can the check-in be moved to Saturday, or is Friday fixed?",
    "Is the price negotiable if we pay the full amount upfront?",
    "Does this unit have a sea view? And is there a braai on the balcony?",
    "We would like to book. What are the next steps and how does payment work?",
  ];
  for (const l of someListings.slice(0, 5)) {
    await prisma.enquiry.create({
      data: {
        listingId: l.id,
        buyerId: rand() < 0.5 ? buyer.id : null,
        guestName: pick(["Nadia Petersen", "Kobus Steyn", "Lerato Molefe", "Dinesh Reddy", "Sam Naidu"]),
        guestEmail: "guest@example.com",
        guestPhone: "082 000 0000",
        message: pick(enquiryMsgs),
        status: rand() < 0.4 ? "REPLIED" : "NEW",
        reply: rand() < 0.4 ? "Hi! Yes, still available. I will send you the booking form now." : null,
      },
    });
  }

  return { resorts: resortRecords.length, agents: agentRecords.length, listings: created };
}
