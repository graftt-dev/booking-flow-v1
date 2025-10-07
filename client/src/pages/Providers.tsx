import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import ProgressRibbon from '@/components/ProgressRibbon';
import EducationPill from '@/components/EducationPill';
import ProviderCard from '@/components/ProviderCard';
import { useJourneyStore } from '@/store/journeyStore';
import { providers as allProviders, sortProviders, getProviderPrice } from '@/lib/providers';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateTotals } from '@/lib/pricing';
import { ArrowLeft } from 'lucide-react';

type SortMode = 'recommended' | 'cheapest' | 'earliest';

export default function Providers() {
  const [, setLocation] = useLocation();
  const { size, items, placement, providerId, setProviderId, setTotals } = useJourneyStore();
  const [sortMode, setSortMode] = useState<SortMode>('recommended');
  const [providers, setProviders] = useState(allProviders);
  const [filters, setFilters] = useState({
    distance: 'any',
    rating: 'any',
    recycling: 'any',
    delivery: 'any',
    priceRange: [0, 500],
  });
  
  useEffect(() => {
    const sorted = sortProviders(allProviders, sortMode, size || '6yd', items, placement || 'driveway');
    setProviders(sorted);
  }, [sortMode, size, items, placement]);
  
  const handleSelectProvider = (id: string) => {
    setProviderId(id);
    const provider = allProviders.find(p => p.id === id);
    if (provider && size) {
      const totals = calculateTotals(size, items, placement || 'driveway');
      setTotals(totals);
    }
  };
  
  const handleContinue = () => {
    if (providerId) {
      setLocation('/checkout');
    }
  };
  
  const filteredProviders = providers.slice(0, 9);
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="container mx-auto px-4 py-8"
      >
        <div className="flex items-center justify-center mb-2 relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation('/size')}
            className="absolute left-0"
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-4xl font-bold text-foreground text-center" data-testid="text-page-title">
            Choose a provider
          </h1>
        </div>
        
        <ProgressRibbon currentStep={5} />
        
        <div className="max-w-7xl mx-auto">
          <Tabs value={sortMode} onValueChange={(v) => setSortMode(v as SortMode)} className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList data-testid="tabs-sort">
                <TabsTrigger value="recommended" data-testid="tab-recommended">Recommended</TabsTrigger>
                <TabsTrigger value="cheapest" data-testid="tab-cheapest">Cheapest</TabsTrigger>
                <TabsTrigger value="earliest" data-testid="tab-earliest">Earliest</TabsTrigger>
              </TabsList>
            </div>
          </Tabs>
          
          <div className="mb-6 text-center">
            <Badge variant="secondary" data-testid="badge-count">
              {filteredProviders.length} providers found
            </Badge>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredProviders.map((provider, index) => {
                const price = getProviderPrice(provider, size || '6yd', items, placement || 'driveway');
                const totals = calculateTotals(size || '6yd', items, placement || 'driveway');
                
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
                  />
                );
              })}
            </AnimatePresence>
          </div>
          
          <div className="flex justify-center mt-12">
            <Button
              size="lg"
              onClick={handleContinue}
              disabled={!providerId}
              data-testid="button-continue"
            >
              Continue to Checkout
            </Button>
          </div>
          
          <EducationPill text="We rank real value: total price, timing, reviews, and recycling." />
        </div>
      </motion.main>
    </div>
  );
}
