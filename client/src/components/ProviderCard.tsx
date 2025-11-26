import { useState, forwardRef } from 'react';
import { Star, Shield, Leaf, FileCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn, formatCurrency } from '@/lib/utils';
import type { Provider } from '@/lib/providers';
import { motion, AnimatePresence } from 'framer-motion';
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
  size?: string;
}

function calculateExtraDays(deliveryDate: string, collectionDate: string, standardHireDays: number): number {
  if (!deliveryDate || !collectionDate) return 0;
  const getEffectiveDate = (dateStr: string, useEnd: boolean) => {
    if (dateStr.includes('|')) {
      const [start, end] = dateStr.split('|');
      return new Date(useEnd ? end : start);
    }
    return new Date(dateStr);
  };
  const delivery = getEffectiveDate(deliveryDate, true);
  const collection = getEffectiveDate(collectionDate, false);
  const diffTime = Math.abs(collection.getTime() - delivery.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays - standardHireDays);
}

const ProviderCard = forwardRef<HTMLDivElement, ProviderCardProps>(function ProviderCard(
  {
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
    collectionDate = '',
    size = '6yd'
  }: ProviderCardProps,
  ref
) {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const extraDays = calculateExtraDays(deliveryDate, collectionDate, provider.standardHireDays);
  const extraDaysCost = extraDays * provider.extraDayRate;
  const sizeKey = size as keyof typeof provider.priceBySize;
  const providerBasePrice = provider.priceBySize[sizeKey] || basePrice;
  const subtotal = providerBasePrice + extraDaysCost + extras + permit;
  const totalVat = subtotal * 0.2;
  const totalPrice = subtotal + totalVat;

  return (
    <motion.div
      ref={ref as React.Ref<HTMLDivElement>}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      data-testid={`provider-card-${provider.id}`}
    >
      <div
        className={cn(
          "relative rounded-lg border-2 transition-all bg-card overflow-hidden",
          selected
            ? "border-primary shadow-soft"
            : "border-card-border hover-elevate"
        )}
      >
        <div className="p-4">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-primary">{provider.logo}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate">{provider.name}</h3>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-primary text-primary" />
                    <span className="font-medium text-foreground">{provider.rating}</span>
                    <span>({provider.reviews.toLocaleString()} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Leaf className="w-3 h-3 text-primary" />
                    <span>{provider.recyclingPct}% recycled</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-right flex-shrink-0">
              <p className="text-2xl font-bold text-foreground">{formatCurrency(totalPrice)}</p>
              <p className="text-xs text-muted-foreground">inc. VAT</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3 py-3 border-y border-border text-center">
            <div>
              <p className="text-xs text-muted-foreground">Skip hire</p>
              <p className="text-sm font-semibold text-foreground">{formatCurrency(providerBasePrice)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Hire period</p>
              <p className="text-sm font-semibold text-foreground">{provider.standardHireDays} days</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Extra days</p>
              <p className="text-sm font-semibold text-foreground">{formatCurrency(provider.extraDayRate)}/day</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">VAT</p>
              <p className="text-sm font-semibold text-foreground">{formatCurrency(totalVat)}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between gap-4 mt-3">
            <button 
              onClick={() => setShowBreakdown(!showBreakdown)}
              className="flex items-center gap-1 text-xs text-primary hover:underline"
              data-testid="button-breakdown"
            >
              {showBreakdown ? 'Hide' : 'View'} full breakdown
              {showBreakdown ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            
            <Button
              onClick={onSelect}
              variant={selected ? "default" : "outline"}
              size="sm"
              className="min-w-28"
              data-testid={`button-select-${provider.id}`}
            >
              {selected ? 'Selected' : 'Select'}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {showBreakdown && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 pt-2 bg-muted/30 border-t border-border">
                <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                  <div>
                    <h4 className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wide">Price Breakdown</h4>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Skip hire (base)</span>
                        <span className="font-medium">{formatCurrency(providerBasePrice)}</span>
                      </div>
                      {extraDays > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Extra days ({extraDays} × {formatCurrency(provider.extraDayRate)})</span>
                          <span className="font-medium">{formatCurrency(extraDaysCost)}</span>
                        </div>
                      )}
                      {items.length > 0 && items.map((item) => {
                        const quantity = itemQuantities[item] || 1;
                        const itemPrice = itemPrices[item] || 0;
                        const itemTotal = itemPrice * quantity;
                        return (
                          <div key={item} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              {quantity > 1 ? `${quantity}× ` : ''}{item}
                            </span>
                            <span className="font-medium">{formatCurrency(itemTotal)}</span>
                          </div>
                        );
                      })}
                      {placement === 'road' && permit > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Road permit</span>
                          <span className="font-medium">{formatCurrency(permit)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">VAT (20%)</span>
                        <span className="font-medium">{formatCurrency(totalVat)}</span>
                      </div>
                      <div className="flex justify-between text-sm font-semibold pt-1.5 border-t border-border">
                        <span>Total</span>
                        <span className="text-primary">{formatCurrency(totalPrice)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wide">Provider Credentials</h4>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-sm">
                        <Shield className="w-3.5 h-3.5 text-primary" />
                        <span className="text-muted-foreground">Waste Carrier:</span>
                        <span className="font-medium text-foreground">{provider.wasteCarrierLicense}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <FileCheck className="w-3.5 h-3.5 text-primary" />
                        <span className="text-muted-foreground">Site Permit:</span>
                        <span className="font-medium text-foreground">{provider.sitePermit}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Leaf className="w-3.5 h-3.5 text-primary" />
                        <span className="text-muted-foreground">Recycling Rate:</span>
                        <span className="font-medium text-foreground">{provider.recyclingPct}%</span>
                      </div>
                    </div>
                    
                    <h4 className="text-xs font-semibold text-foreground mb-2 mt-4 uppercase tracking-wide">What's Included</h4>
                    <ul className="space-y-1">
                      {provider.inclusions.map((inclusion, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-primary" />
                          {inclusion}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
});

export default ProviderCard;
