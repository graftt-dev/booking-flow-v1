import type { SkipSize } from '../store/journeyStore';

export const basePrices: Record<SkipSize, number> = {
  "2yd": 140,
  "3yd": 160,
  "4yd": 180,
  "6yd": 220,
  "8yd": 260,
  "12yd": 340,
  "14yd": 380,
  "16yd": 420,
};

export const itemPrices: Record<string, number> = {
  "Mattress": 15,
  "Sofa": 12,
  "Tyres": 20,
  "Fridge/Freezer": 25,
  "Plasterboard": 10,
  "Gas Bottles": 15,
  "Batteries": 5,
};

export const calculateExtras = (items: string[], itemQuantities: Record<string, number> = {}): number => {
  return items.reduce((total, item) => {
    const price = itemPrices[item] || 0;
    const quantity = itemQuantities[item] || 1;
    return total + (price * quantity);
  }, 0);
};

export const calculatePermit = (placement: string, postcode: string): number => {
  if (placement !== 'road') return 0;
  return 50;
};

export const calculateTotals = (
  size: SkipSize | null,
  items: string[],
  placement: string,
  itemQuantities: Record<string, number> = {}
) => {
  if (!size) {
    return { base: 0, extras: 0, permit: 0, vat: 0, total: 0 };
  }
  
  const base = basePrices[size];
  const extras = calculateExtras(items, itemQuantities);
  const permit = calculatePermit(placement, '');
  const totalExVat = base + extras + permit;
  const vat = totalExVat * 0.2;
  const total = totalExVat + vat;
  
  return { base, extras, permit, vat, total };
};
