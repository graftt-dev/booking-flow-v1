import { Star, Shield, Leaf, FileCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn, formatCurrency } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { Provider } from '@/lib/providers';
import { motion } from 'framer-motion';
import { itemPrices } from '@/lib/pricing';

interface ProviderCardProps {
  provider: Provider;
  price: number;
  selected?: boolean;
  onSelect: () => void;
  index?: number;
  basePrice: number;
  extras: number;
  permit: number;
  vat: number;
  items: string[];
  itemQuantities: Record<string, number>;
  placement: string;
  deliveryDate?: string;
  collectionDate?: string;
}

function calculateExtraDays(deliveryDate: string, collectionDate: string, standardHireDays: number): number {
  if (!deliveryDate || !collectionDate) return 0;
  const delivery = new Date(deliveryDate);
  const collection = new Date(collectionDate);
  const diffTime = Math.abs(collection.getTime() - delivery.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays - standardHireDays);
}

export default function ProviderCard({
  provider,
  price,
  selected,
  onSelect,
  index = 0,
  basePrice,
  extras,
  permit,
  vat,
  items,
  itemQuantities,
  placement,
  deliveryDate = '',
  collectionDate = ''
}: ProviderCardProps) {
  const extraDays = calculateExtraDays(deliveryDate, collectionDate, provider.standardHireDays);
  const extraDaysCost = extraDays * provider.extraDayRate;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      data-testid={`provider-card-${provider.id}`}
    >
      <div
        className={cn(
          "relative p-4 rounded-md border-2 transition-all bg-card hover-elevate",
          selected
            ? "border-primary shadow-soft"
            : "border-card-border"
        )}
      >
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-primary">{provider.logo}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate">{provider.name}</h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-primary text-primary" />
                  <span className="font-medium">{provider.rating}</span>
                  <span>({provider.reviews.toLocaleString()})</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-right flex-shrink-0">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-foreground">{formatCurrency(price + extraDaysCost + (extraDaysCost * 0.2))}</span>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <button className="text-xs text-primary hover:underline" data-testid="button-breakdown">
                  Breakdown
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80" data-testid="price-breakdown">
                <div className="space-y-2">
                  <h4 className="font-semibold mb-3">Price Breakdown</h4>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Base price</span>
                    <span>{formatCurrency(basePrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Days hire</span>
                    <span>{provider.standardHireDays} days included</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Extra days {extraDays > 0 ? `(${extraDays} days × ${formatCurrency(provider.extraDayRate)}/day)` : ''}
                    </span>
                    <span>{extraDays > 0 ? formatCurrency(extraDaysCost) : formatCurrency(0)}</span>
                  </div>
                  {items.length > 0 && items.map((item) => {
                    const quantity = itemQuantities[item] || 1;
                    const itemPrice = itemPrices[item] || 0;
                    const itemTotal = itemPrice * quantity;
                    return (
                      <div key={item} className="flex justify-between text-sm pl-3">
                        <span className="text-muted-foreground">
                          {quantity > 1 ? `${quantity}× ` : ''}{item}
                        </span>
                        <span>{formatCurrency(itemTotal)}</span>
                      </div>
                    );
                  })}
                  {placement === 'road' && permit > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Road permit</span>
                      <span>{formatCurrency(permit)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">VAT (20%)</span>
                    <span>{formatCurrency(vat + (extraDaysCost * 0.2))}</span>
                  </div>
                  <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{formatCurrency(price + extraDaysCost + (extraDaysCost * 0.2))}</span>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-xs flex-1 flex-wrap">
            <div className="flex items-center gap-1.5">
              <Shield className="w-3 h-3 text-primary" />
              <span className="text-muted-foreground">
                Waste Carriers: <span className="text-primary font-medium">{provider.wasteCarrierLicense}</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <FileCheck className="w-3 h-3 text-primary" />
              <span className="text-muted-foreground">
                Site Permit: <span className="text-primary font-medium">{provider.sitePermit}</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Leaf className="w-3 h-3 text-primary" />
              <span className="text-muted-foreground">
                Recycling Rate: <span className="text-primary font-medium">{provider.recyclingPct}%</span>
              </span>
            </div>
          </div>
          
          <Button
            onClick={onSelect}
            variant={selected ? "default" : "outline"}
            size="sm"
            className="min-w-28"
            data-testid={`button-select-${provider.id}`}
          >
            {selected ? 'Selected ✓' : 'Select'}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
