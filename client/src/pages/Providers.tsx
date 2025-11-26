import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import ProgressRibbon from '@/components/ProgressRibbon';
import EducationPill from '@/components/EducationPill';
import ProviderCard from '@/components/ProviderCard';
import { useJourneyStore } from '@/store/journeyStore';
import { providers as allProviders, sortProviders, getProviderPrice } from '@/lib/providers';
import { motion } from 'framer-motion';
import { calculateTotals } from '@/lib/pricing';
import { ArrowLeft, MapPin, Package, Trash2, Calendar, CalendarCheck, Lightbulb } from 'lucide-react';
import { format, parse } from 'date-fns';

type SortMode = 'best' | 'cheapest' | 'greenest';

const skipSizeNames: Record<string, { name: string; yards: string }> = {
  '2yd': { name: 'Mini Skip', yards: '2 cubic yards' },
  '4yd': { name: 'Midi Skip', yards: '4 cubic yards' },
  '6yd': { name: 'Builders Skip', yards: '6 cubic yards' },
  '8yd': { name: 'Large Skip', yards: '8 cubic yards' },
  '12yd': { name: 'Maxi Skip', yards: '12 cubic yards' },
  '14yd': { name: 'Large Maxi', yards: '14 cubic yards' },
  '16yd': { name: 'Roll-on Roll-off', yards: '16 cubic yards' },
};

function formatDateDisplay(dateStr: string): string {
  if (!dateStr) return 'Not selected';
  
  if (dateStr.includes('|')) {
    const [start, end] = dateStr.split('|');
    const startDate = parse(start, 'yyyy-MM-dd', new Date());
    const endDate = parse(end, 'yyyy-MM-dd', new Date());
    return `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d')}`;
  }
  
  const date = parse(dateStr, 'yyyy-MM-dd', new Date());
  return format(date, 'EEE, MMM d');
}

export default function Providers() {
  const [, setLocation] = useLocation();
  const { 
    size, items, itemQuantities, placement, providerId, setProviderId, setTotals, 
    deliveryDate, collectionDate, postcode, address, wasteType 
  } = useJourneyStore();
  const [sortMode, setSortMode] = useState<SortMode>('best');
  const [providers, setProviders] = useState(allProviders);
  
  useEffect(() => {
    const sorted = sortProviders(allProviders, sortMode, size || '6yd', items, placement || 'driveway');
    setProviders(sorted);
  }, [sortMode, size, items, placement]);
  
  const handleSelectProvider = (id: string) => {
    setProviderId(id);
    const provider = allProviders.find(p => p.id === id);
    if (provider && size) {
      const totals = calculateTotals(size, items, placement || 'driveway', itemQuantities);
      setTotals(totals);
    }
  };
  
  const handleContinue = () => {
    if (providerId) {
      setLocation('/items');
    }
  };
  
  const filteredProviders = providers.slice(0, 9);
  const skipInfo = skipSizeNames[size || '6yd'] || { name: 'Skip', yards: '' };
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="px-4 py-8"
      >
        <h1 className="text-4xl font-bold text-foreground text-center mb-2" data-testid="text-page-title">
          Choose a provider
        </h1>
        
        <ProgressRibbon currentStep={4} />
        
        <div className="flex">
          <div className="hidden lg:block w-72 flex-shrink-0 pl-4">
            <Card className="sticky top-4 p-5">
              <h2 className="text-lg font-semibold text-foreground mb-1">Your Selection</h2>
              <p className="text-sm text-muted-foreground mb-5">Edit any detail to update providers</p>
              
              <div className="space-y-5">
                <button 
                  onClick={() => setLocation('/placement')}
                  className="w-full text-left group"
                  data-testid="button-edit-location"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-primary uppercase tracking-wide mb-1">Location</p>
                      <p className="font-semibold text-foreground">{postcode || 'Not set'}</p>
                      {address && (
                        <p className="text-sm text-muted-foreground truncate">{address}</p>
                      )}
                      {placement && (
                        <Badge variant="secondary" className="mt-1.5 text-xs">
                          {placement === 'driveway' ? 'On Property' : 'On Road'}
                        </Badge>
                      )}
                    </div>
                  </div>
                </button>
                
                <div className="border-t border-border" />
                
                <button 
                  onClick={() => setLocation('/skip-size')}
                  className="w-full text-left group"
                  data-testid="button-edit-size"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Package className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-primary uppercase tracking-wide mb-1">Skip Size</p>
                      <p className="font-semibold text-foreground">{skipInfo.name}</p>
                      <p className="text-sm text-muted-foreground">{skipInfo.yards}</p>
                    </div>
                  </div>
                </button>
                
                <div className="border-t border-border" />
                
                <button 
                  onClick={() => setLocation('/waste-type')}
                  className="w-full text-left group"
                  data-testid="button-edit-waste"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Trash2 className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-primary uppercase tracking-wide mb-1">Waste Type</p>
                      <p className="font-semibold text-foreground">{wasteType || 'General Waste'}</p>
                    </div>
                  </div>
                </button>
                
                <div className="border-t border-border" />
                
                <button 
                  onClick={() => setLocation('/delivery-date')}
                  className="w-full text-left group"
                  data-testid="button-edit-delivery"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-primary uppercase tracking-wide mb-1">Delivery Timeframe</p>
                      <p className="font-semibold text-foreground">{formatDateDisplay(deliveryDate)}</p>
                    </div>
                  </div>
                </button>
                
                <div className="border-t border-border" />
                
                <button 
                  onClick={() => setLocation('/delivery-date')}
                  className="w-full text-left group"
                  data-testid="button-edit-collection"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <CalendarCheck className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-primary uppercase tracking-wide mb-1">Collection Timeframe</p>
                      <p className="font-semibold text-foreground">{formatDateDisplay(collectionDate)}</p>
                    </div>
                  </div>
                </button>
              </div>
              
              <div className="mt-6 pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Lightbulb className="w-4 h-4 text-primary" />
                  <span>Click any item to update and see new providers</span>
                </div>
              </div>
            </Card>
          </div>
          
          <div className="flex-1 max-w-3xl mx-auto">
            <Tabs value={sortMode} onValueChange={(v) => setSortMode(v as SortMode)} className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList data-testid="tabs-sort">
                  <TabsTrigger value="best" data-testid="tab-best">Best</TabsTrigger>
                  <TabsTrigger value="cheapest" data-testid="tab-cheapest">Cheapest</TabsTrigger>
                  <TabsTrigger value="greenest" data-testid="tab-greenest">Greenest</TabsTrigger>
                </TabsList>
              </div>
            </Tabs>
            
            <div className="mb-6 text-center">
              <Badge variant="secondary" data-testid="badge-count">
                {filteredProviders.length} providers found
              </Badge>
            </div>
            
            <div className="space-y-4">
              {filteredProviders.map((provider, index) => {
                const price = getProviderPrice(provider, size || '6yd', items, placement || 'driveway');
                const totals = calculateTotals(size || '6yd', items, placement || 'driveway', itemQuantities);
                
                return (
                  <ProviderCard
                    key={provider.id}
                    provider={provider}
                    price={price}
                    selected={providerId === provider.id}
                    onSelect={() => handleSelectProvider(provider.id)}
                    index={index}
                    basePrice={totals.base}
                    extras={totals.extras}
                    permit={totals.permit}
                    vat={totals.vat}
                    items={items}
                    itemQuantities={itemQuantities}
                    placement={placement || 'driveway'}
                    deliveryDate={deliveryDate}
                    collectionDate={collectionDate}
                  />
                );
              })}
            </div>
            
            <div className="flex justify-center items-center gap-4 mt-12">
              <Button
                variant="ghost"
                onClick={() => setLocation('/delivery-date')}
                data-testid="button-back"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                size="lg"
                onClick={handleContinue}
                disabled={!providerId}
                data-testid="button-continue"
              >
                Continue
              </Button>
            </div>
            
            <EducationPill text="We rank real value: total price, timing, reviews, and recycling." />
          </div>
        </div>
      </motion.main>
    </div>
  );
}
