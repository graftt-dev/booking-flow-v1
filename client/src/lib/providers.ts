export interface Provider {
  id: string;
  name: string;
  logo: string;
  priceBySize: {
    "2yd": number;
    "4yd": number;
    "6yd": number;
    "8yd": number;
    "12yd": number;
    "14yd": number;
    "16yd": number;
  };
  rating: number;
  reviews: number;
  recyclingPct: number;
  onTimePct: number;
  badges: string[];
  distanceKm: number;
  earliestDay: string;
  earliestRange: string;
  inclusions: string[];
  wasteCarrierLicense: string;
  sitePermit: string;
  standardHireDays: number;
  extraDayRate: number;
}

export const providers: Provider[] = [
  {
    id: "budget-waste",
    name: "Budget Waste Management",
    logo: "BWM",
    priceBySize: { "2yd": 140, "4yd": 180, "6yd": 220, "8yd": 260, "12yd": 340, "14yd": 380, "16yd": 420 },
    rating: 4.7,
    reviews: 1248,
    recyclingPct: 78,
    onTimePct: 92,
    badges: ["Licensed Operator", "Permit-ready", "High Recycling 78%", "On-time 92%"],
    distanceKm: 3.2,
    earliestDay: "Tue AM",
    earliestRange: "8-11",
    inclusions: ["2-week hire", "Same-day delivery", "Free permit handling"],
    wasteCarrierLicense: "CBDL847291",
    sitePermit: "EPR/LP3847CF",
    standardHireDays: 14,
    extraDayRate: 5
  },
  {
    id: "eco-skip",
    name: "EcoSkip Solutions",
    logo: "ES",
    priceBySize: { "2yd": 155, "4yd": 195, "6yd": 235, "8yd": 275, "12yd": 360, "14yd": 400, "16yd": 440 },
    rating: 4.9,
    reviews: 892,
    recyclingPct: 85,
    onTimePct: 96,
    badges: ["Licensed Operator", "Permit-ready", "High Recycling 85%", "On-time 96%"],
    distanceKm: 5.1,
    earliestDay: "Wed AM",
    earliestRange: "9-12",
    inclusions: ["3-week hire", "Eco-friendly", "Free waste sorting"],
    wasteCarrierLicense: "CBDL592184",
    sitePermit: "EPR/LP7621CF",
    standardHireDays: 21,
    extraDayRate: 4
  },
  {
    id: "rapid-waste",
    name: "Rapid Waste Services",
    logo: "RW",
    priceBySize: { "2yd": 135, "4yd": 175, "6yd": 215, "8yd": 255, "12yd": 330, "14yd": 370, "16yd": 410 },
    rating: 4.5,
    reviews: 2103,
    recyclingPct: 72,
    onTimePct: 88,
    badges: ["Licensed Operator", "Permit-ready", "High Recycling 72%", "On-time 88%"],
    distanceKm: 2.8,
    earliestDay: "Mon PM",
    earliestRange: "13-16",
    inclusions: ["10-day hire", "Next-day collection", "Extended hours"],
    wasteCarrierLicense: "CBDL316758",
    sitePermit: "EPR/LP1294CF",
    standardHireDays: 10,
    extraDayRate: 6
  },
  {
    id: "green-bins",
    name: "Green Bins Ltd",
    logo: "GB",
    priceBySize: { "2yd": 148, "4yd": 188, "6yd": 228, "8yd": 268, "12yd": 348, "14yd": 388, "16yd": 428 },
    rating: 4.8,
    reviews: 1567,
    recyclingPct: 81,
    onTimePct: 94,
    badges: ["Licensed Operator", "Permit-ready", "High Recycling 81%", "On-time 94%"],
    distanceKm: 4.5,
    earliestDay: "Tue PM",
    earliestRange: "14-17",
    inclusions: ["2-week hire", "Free permits", "Recycling report"],
    wasteCarrierLicense: "CBDL729463",
    sitePermit: "EPR/LP5038CF",
    standardHireDays: 14,
    extraDayRate: 5
  },
  {
    id: "clearway",
    name: "Clearway Skip Hire",
    logo: "CW",
    priceBySize: { "2yd": 152, "4yd": 192, "6yd": 232, "8yd": 272, "12yd": 352, "14yd": 392, "16yd": 432 },
    rating: 4.6,
    reviews: 743,
    recyclingPct: 76,
    onTimePct: 91,
    badges: ["Licensed Operator", "Permit-ready", "High Recycling 76%", "On-time 91%"],
    distanceKm: 6.2,
    earliestDay: "Thu AM",
    earliestRange: "8-11",
    inclusions: ["2-week hire", "24/7 support", "Flexible collection"],
    wasteCarrierLicense: "CBDL483926",
    sitePermit: "EPR/LP8467CF",
    standardHireDays: 14,
    extraDayRate: 4
  },
  {
    id: "premier-skip",
    name: "Premier Skip Co",
    logo: "PS",
    priceBySize: { "2yd": 158, "4yd": 198, "6yd": 238, "8yd": 278, "12yd": 358, "14yd": 398, "16yd": 438 },
    rating: 4.7,
    reviews: 1891,
    recyclingPct: 79,
    onTimePct: 93,
    badges: ["Licensed Operator", "Permit-ready", "High Recycling 79%", "On-time 93%"],
    distanceKm: 3.9,
    earliestDay: "Wed PM",
    earliestRange: "13-16",
    inclusions: ["3-week hire", "Premium service", "Priority delivery"],
    wasteCarrierLicense: "CBDL651842",
    sitePermit: "EPR/LP2915CF",
    standardHireDays: 21,
    extraDayRate: 6
  },
  {
    id: "urban-waste",
    name: "Urban Waste Group",
    logo: "UW",
    priceBySize: { "2yd": 145, "4yd": 185, "6yd": 225, "8yd": 265, "12yd": 345, "14yd": 385, "16yd": 425 },
    rating: 4.4,
    reviews: 1124,
    recyclingPct: 74,
    onTimePct: 89,
    badges: ["Licensed Operator", "Permit-ready", "High Recycling 74%", "On-time 89%"],
    distanceKm: 5.7,
    earliestDay: "Fri AM",
    earliestRange: "9-12",
    inclusions: ["2-week hire", "City specialist", "Same-week service"],
    wasteCarrierLicense: "CBDL274815",
    sitePermit: "EPR/LP6183CF",
    standardHireDays: 14,
    extraDayRate: 5
  },
  {
    id: "fast-skip",
    name: "Fast Skip Removals",
    logo: "FS",
    priceBySize: { "2yd": 138, "4yd": 178, "6yd": 218, "8yd": 258, "12yd": 335, "14yd": 375, "16yd": 415 },
    rating: 4.6,
    reviews: 956,
    recyclingPct: 77,
    onTimePct: 90,
    badges: ["Licensed Operator", "Permit-ready", "High Recycling 77%", "On-time 90%"],
    distanceKm: 4.1,
    earliestDay: "Mon AM",
    earliestRange: "8-11",
    inclusions: ["10-day hire", "Express delivery", "Weekend service"],
    wasteCarrierLicense: "CBDL938671",
    sitePermit: "EPR/LP4572CF",
    standardHireDays: 10,
    extraDayRate: 7
  },
];

export const getProviderPrice = (provider: Provider, size: string, items: string[], placement: string): number => {
  const basePrice = provider.priceBySize[size as keyof typeof provider.priceBySize] || 0;
  const extrasPrice = items.length * 15;
  const permitPrice = placement === 'road' ? 50 : 0;
  const subtotal = basePrice + extrasPrice + permitPrice;
  const vat = subtotal * 0.2;
  return subtotal + vat;
};

export const sortProviders = (providers: Provider[], mode: 'recommended' | 'cheapest' | 'earliest', size: string, items: string[], placement: string) => {
  const sorted = [...providers];
  
  if (mode === 'cheapest') {
    sorted.sort((a, b) => getProviderPrice(a, size, items, placement) - getProviderPrice(b, size, items, placement));
  } else if (mode === 'earliest') {
    const dayOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    sorted.sort((a, b) => {
      const aDay = dayOrder.indexOf(a.earliestDay.split(' ')[0]);
      const bDay = dayOrder.indexOf(b.earliestDay.split(' ')[0]);
      if (aDay !== bDay) return aDay - bDay;
      return b.rating - a.rating;
    });
  } else {
    sorted.sort((a, b) => {
      const aPrice = getProviderPrice(a, size, items, placement);
      const bPrice = getProviderPrice(b, size, items, placement);
      const aDay = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].indexOf(a.earliestDay.split(' ')[0]);
      const bDay = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].indexOf(b.earliestDay.split(' ')[0]);
      const aScore = (aPrice * 0.35) + (aDay * 50 * 0.25) + ((5 - a.rating) * 100 * 0.2) + ((100 - a.recyclingPct) * 2 * 0.2);
      const bScore = (bPrice * 0.35) + (bDay * 50 * 0.25) + ((5 - b.rating) * 100 * 0.2) + ((100 - b.recyclingPct) * 2 * 0.2);
      return aScore - bScore;
    });
  }
  
  return sorted;
};
