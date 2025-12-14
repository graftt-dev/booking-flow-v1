import { useState } from 'react';
import { Star, Shield, Leaf, ChevronDown, BadgeCheck, ShieldCheck, ShieldQuestion, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn, formatCurrency } from '@/lib/utils';
import type { Provider, VerificationStatus } from '@/lib/providers';
import { motion, AnimatePresence } from 'framer-motion';
import { itemPrices } from '@/lib/pricing';

const verificationConfig: Record<VerificationStatus, { label: string; description: string; icon: typeof ShieldCheck; className: string; iconStyle?: React.CSSProperties; textStyle?: React.CSSProperties }> = {
  'guaranteed': {
    label: 'GRAFTT Guaranteed',
    description: 'Verified documentation reviewed by GRAFTT with platform-level protections',
    icon: ShieldCheck,
    className: 'bg-[#05E4C0]/10 border-[#05E4C0]/20',
    iconStyle: { color: '#05E4C0' },
    textStyle: { color: '#06062D' }
  },
  'not-verified': {
    label: 'Not Yet Verified',
    description: 'This provider has not yet completed GRAFTT\'s verification process',
    icon: ShieldQuestion,
    className: 'bg-[#06062D]/10 border-[#06062D]/20',
    iconStyle: { color: '#06062D' },
    textStyle: { color: '#06062D' }
  },
  'not-guaranteed': {
    label: 'Not GRAFTT Guaranteed',
    description: 'This listing is not covered by the GRAFTT Guarantee',
    icon: ShieldAlert,
    className: 'bg-muted text-muted-foreground border-border'
  }
};

interface ProviderCardProps {
  provider: Provider;
  price: number;
  selected?: boolean;
  onSelect: () => void;
  onRequestQuote?: () => void;
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
  onRequestQuote,
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
  const [expanded, setExpanded] = useState(false);
  const extraDays = calculateExtraDays(deliveryDate, collectionDate, provider.standardHireDays);
  const extraDaysCost = extraDays * provider.extraDayRate;
  const totalPrice = (basePrice + extraDaysCost + extras + permit) * 1.2;
  
  const isDisabled = provider.verificationStatus === 'not-guaranteed';
  const isNotVerified = provider.verificationStatus === 'not-verified';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      data-testid={`provider-card-${provider.id}`}
    >
      <div
        className={cn(
          "relative p-4 rounded-md border-2 transition-all bg-card",
          isDisabled && "opacity-50 pointer-events-none grayscale",
          selected
            ? "border-primary shadow-soft"
            : "border-card-border hover-elevate"
        )}
      >
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-lg font-bold text-primary">{provider.logo}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-foreground text-lg">{provider.name}</h3>
                {(() => {
                  const config = verificationConfig[provider.verificationStatus];
                  const IconComponent = config.icon;
                  return (
                    <span 
                      className={cn("inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full border", config.className)}
                      title={config.description}
                      data-testid={`badge-verification-${provider.id}`}
                    >
                      <IconComponent className="w-3 h-3" style={config.iconStyle} />
                      <span style={config.textStyle}>{config.label}</span>
                    </span>
                  );
                })()}
              </div>
              {!isDisabled && !isNotVerified && (
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                  <span className="text-sm font-semibold text-foreground">{provider.rating}</span>
                  <span className="text-sm text-muted-foreground">({provider.reviews.toLocaleString()} reviews)</span>
                </div>
              )}
            </div>
          </div>
          
          {!isDisabled && (
            <div className="text-right flex-shrink-0">
              {isNotVerified ? (
                <>
                  <span className="text-2xl font-bold text-foreground" data-testid={`price-${provider.id}`}>POQ</span>
                  <p className="text-xs text-muted-foreground">Price on Quote</p>
                </>
              ) : (
                <>
                  <span className="text-2xl font-bold text-foreground" data-testid={`price-${provider.id}`}>{formatCurrency(totalPrice)}</span>
                  <p className="text-xs text-muted-foreground">inc. VAT</p>
                </>
              )}
            </div>
          )}
        </div>

        {!isDisabled && !isNotVerified && (
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1.5">
              <BadgeCheck className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Licensed Operator</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Leaf className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground"><span className="font-semibold">{provider.recyclingPct}%</span> Recycled</span>
            </div>
          </div>
        )}
        
        {isNotVerified && (
          <div className="mb-4" />
        )}
        
        {!isDisabled && (
          <div className="flex items-center justify-between gap-4">
            {!isNotVerified ? (
              <button 
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-1 text-xs text-primary hover:underline"
                data-testid="button-breakdown"
              >
                <span>{expanded ? 'Hide' : 'View'} breakdown</span>
                <ChevronDown className={cn("w-3 h-3 transition-transform", expanded && "rotate-180")} />
              </button>
            ) : (
              <div />
            )}
            
            {isNotVerified ? (
              <Button
                onClick={onRequestQuote}
                variant="outline"
                size="sm"
                className="min-w-28"
                data-testid={`button-quote-${provider.id}`}
              >
                Get a Quote
              </Button>
            ) : (
              <Button
                onClick={onSelect}
                variant={selected ? "default" : "outline"}
                size="sm"
                className="min-w-28"
                data-testid={`button-select-${provider.id}`}
              >
                {selected ? 'Selected' : 'Select'}
              </Button>
            )}
          </div>
        )}

        <AnimatePresence>
          {expanded && !isDisabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="pt-4 mt-4 border-t border-border space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
                    <Shield className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Waste Carriers License</p>
                      <p className="text-sm font-semibold text-foreground">{provider.wasteCarrierLicense}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
                    <BadgeCheck className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Site Permit</p>
                      <p className="text-sm font-semibold text-foreground">{provider.sitePermit}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Price Breakdown</h4>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Base price</span>
                      <span>{formatCurrency(basePrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Hire terms</span>
                      <span className="text-primary font-medium">{provider.standardHireDays} days included</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Extra days {extraDays > 0 ? `(${extraDays} × ${formatCurrency(provider.extraDayRate)})` : `@ ${formatCurrency(provider.extraDayRate)}/day`}
                      </span>
                      <span>{formatCurrency(extraDaysCost)}</span>
                    </div>
                    {items.length > 0 && items.map((item) => {
                      const quantity = itemQuantities[item] || 1;
                      const itemPrice = itemPrices[item] || 0;
                      const itemTotal = itemPrice * quantity;
                      return (
                        <div key={item} className="flex justify-between">
                          <span className="text-muted-foreground">
                            {quantity > 1 ? `${quantity}× ` : ''}{item}
                          </span>
                          <span>{formatCurrency(itemTotal)}</span>
                        </div>
                      );
                    })}
                    {placement === 'road' && permit > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Road permit</span>
                        <span>{formatCurrency(permit)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">VAT (20%)</span>
                      <span>{formatCurrency((basePrice + extraDaysCost + extras + permit) * 0.2)}</span>
                    </div>
                    <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
                      <span>Total</span>
                      <span className="text-primary">{formatCurrency(totalPrice)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
