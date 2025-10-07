import { Star, Clock, Shield, Leaf, Award, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn, formatCurrency } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { Provider } from '@/lib/providers';
import { motion } from 'framer-motion';

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
  vat
}: ProviderCardProps) {
  const iconMap: Record<string, any> = {
    'Licensed Operator': Shield,
    'Permit-ready': Award,
    'High Recycling': Leaf,
    'On-time': Clock,
  };
  
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
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{provider.earliestDay}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-right flex-shrink-0">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-foreground">{formatCurrency(price)}</span>
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
                  {extras > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Extra items</span>
                      <span>{formatCurrency(extras)}</span>
                    </div>
                  )}
                  {permit > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Permit fee</span>
                      <span>{formatCurrency(permit)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">VAT (20%)</span>
                    <span>{formatCurrency(vat)}</span>
                  </div>
                  <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{formatCurrency(price)}</span>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-xs flex-1">
            {provider.badges.slice(0, 3).map((badge) => {
              const BadgeIcon = iconMap[badge.split(' ')[0] + (badge.includes('Recycling') ? ' Recycling' : badge.includes('On-time') ? ' On-time' : ' ' + badge.split(' ')[1])] || Shield;
              return (
                <div key={badge} className="flex items-center gap-1.5">
                  <BadgeIcon className="w-3 h-3 text-primary" />
                  <span className="text-muted-foreground">{badge}</span>
                </div>
              );
            })}
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
