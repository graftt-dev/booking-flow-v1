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
          "relative p-6 rounded-md border-2 transition-all bg-card hover-elevate",
          selected
            ? "border-primary shadow-soft"
            : "border-card-border"
        )}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-bold text-primary">{provider.logo}</span>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{provider.name}</h3>
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-4 h-4 fill-primary text-primary" />
                <span className="text-sm font-medium">{provider.rating}</span>
                <span className="text-xs text-muted-foreground">({provider.reviews.toLocaleString()} reviews)</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-bold text-foreground">{formatCurrency(price)}</span>
            <span className="text-sm text-muted-foreground">all-in</span>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <button className="text-sm text-primary hover:underline" data-testid="button-breakdown">
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
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Clock className="w-4 h-4" />
          <span>Earliest: {provider.earliestDay} ({provider.earliestRange})</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-4">
          {provider.badges.slice(0, 4).map((badge) => {
            const BadgeIcon = iconMap[badge.split(' ')[0] + (badge.includes('Recycling') ? ' Recycling' : badge.includes('On-time') ? ' On-time' : ' ' + badge.split(' ')[1])] || Shield;
            return (
              <div key={badge} className="flex items-center gap-1.5">
                <BadgeIcon className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs text-muted-foreground truncate">{badge}</span>
              </div>
            );
          })}
        </div>
        
        <div className="mb-4">
          <p className="text-sm font-medium mb-2">What's included:</p>
          <ul className="space-y-1">
            {provider.inclusions.map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <Button
          onClick={onSelect}
          variant={selected ? "default" : "outline"}
          className="w-full"
          data-testid={`button-select-${provider.id}`}
        >
          {selected ? 'Selected ✓' : 'Select'}
        </Button>
      </div>
    </motion.div>
  );
}
