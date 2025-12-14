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
import { motion, AnimatePresence } from 'framer-motion';
import { calculateTotals } from '@/lib/pricing';
import { 
  ArrowLeft, MapPin, Package, Trash2, Calendar, CalendarCheck, Lightbulb, Phone, MessageCircle,
  ShieldCheck, Crown, Sparkles, AlertTriangle, Clock, FileQuestion, ChevronRight
} from 'lucide-react';
import { format, parse } from 'date-fns';

const NO_PROVIDER_POSTCODES = ['M1 1AE'];

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
  const [showNotGuaranteed, setShowNotGuaranteed] = useState(false);
  
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
  
  const handleRequestQuote = (providerIdToQuote: string) => {
    setProviderId(providerIdToQuote);
    setLocation('/quote-request');
  };
  
  const filteredProviders = providers.slice(0, 9);
  const skipInfo = skipSizeNames[size || '6yd'] || { name: 'Skip', yards: '' };
  const hasNoProviders = NO_PROVIDER_POSTCODES.includes(postcode);
  
  const guaranteedProviders = filteredProviders.filter(p => p.verificationStatus === 'guaranteed');
  const notVerifiedProviders = filteredProviders.filter(p => p.verificationStatus === 'not-verified');
  const notGuaranteedProviders = filteredProviders.filter(p => p.verificationStatus === 'not-guaranteed');
  
  if (hasNoProviders) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <motion.main 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="container mx-auto px-4 py-8"
        >
          <div className="max-w-2xl mx-auto text-center">
            <ProgressRibbon currentStep={4} />
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-12"
            >
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Phone className="w-10 h-10 text-primary" />
              </div>
              
              <h1 className="text-3xl font-bold text-foreground mb-4" data-testid="text-no-providers-title">
                We'd love to help you personally
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
                We're still growing our online network in your area. Give us a quick call and we will handle your order personally with one of our trusted providers.
              </p>
              
              <Card className="p-6 mb-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-3">
                    <Phone className="w-5 h-5 text-primary" />
                    <a 
                      href="tel:03330508776" 
                      className="text-2xl font-bold text-primary hover:underline"
                      data-testid="link-phone"
                    >
                      0333 050 8776
                    </a>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Mon-Sun 24/7
                  </p>
                </div>
              </Card>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  size="lg"
                  onClick={() => window.location.href = 'tel:03330508776'}
                  className="w-full sm:w-auto"
                  data-testid="button-call-us"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Us Now
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setLocation('/')}
                  className="w-full sm:w-auto"
                  data-testid="button-try-different"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Try a Different Location
                </Button>
              </div>
              
              <div className="mt-8 p-4 bg-muted/50 rounded-md">
                <div className="flex items-start gap-3 text-left">
                  <MessageCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Why call?</p>
                    <p className="text-sm text-muted-foreground">
                      Our team can arrange skip hire even in areas not yet on our platform. We'll get you sorted!
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="px-4 py-8 relative"
      >
        <div className="hidden lg:block fixed left-28 top-80 w-72 z-10">
          <Card className="p-5">
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
        
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground text-center mb-2" data-testid="text-page-title">
            Choose a provider
          </h1>
          
          <ProgressRibbon currentStep={4} />
          
          <Tabs value={sortMode} onValueChange={(v) => setSortMode(v as SortMode)} className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList data-testid="tabs-sort">
                <TabsTrigger value="best" data-testid="tab-best">Best</TabsTrigger>
                <TabsTrigger value="cheapest" data-testid="tab-cheapest">Cheapest</TabsTrigger>
                <TabsTrigger value="greenest" data-testid="tab-greenest">Greenest</TabsTrigger>
              </TabsList>
            </div>
          </Tabs>
          
          <div className="space-y-10">
            {/* GRAFTT Guaranteed Section - Premium Tier */}
            {guaranteedProviders.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                data-testid="section-guaranteed"
              >
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-md -m-4 p-4" />
                  <div className="relative flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <Crown className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-xl font-bold text-foreground">GRAFTT Guaranteed</h2>
                          <Sparkles className="w-5 h-5 text-primary" />
                        </div>
                        <p className="text-sm text-muted-foreground">Verified, protected, and trusted providers</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                        <ShieldCheck className="w-3 h-3 mr-1" />
                        {guaranteedProviders.length} Available
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4 relative">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary/50 to-primary/20 rounded-full" />
                  <div className="pl-6">
                    {guaranteedProviders.map((provider, index) => {
                      const price = getProviderPrice(provider, size || '6yd', items, placement || 'driveway');
                      const totals = calculateTotals(size || '6yd', items, placement || 'driveway', itemQuantities);
                      const providerBasePrice = provider.priceBySize[size as keyof typeof provider.priceBySize] || provider.priceBySize['6yd'];
                      
                      return (
                        <div key={provider.id} className="relative">
                          {index === 0 && (
                            <motion.div 
                              className="absolute -left-6 top-4 -ml-1.5 w-4 h-4 rounded-full bg-primary border-4 border-background"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.2 }}
                            />
                          )}
                          <ProviderCard
                            provider={provider}
                            price={price}
                            selected={providerId === provider.id}
                            onSelect={() => handleSelectProvider(provider.id)}
                            index={index}
                            basePrice={providerBasePrice}
                            extras={totals.extras}
                            permit={totals.permit}
                            vat={totals.vat}
                            items={items}
                            itemQuantities={itemQuantities}
                            placement={placement || 'driveway'}
                            deliveryDate={deliveryDate}
                            collectionDate={collectionDate}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <motion.div 
                  className="mt-4 p-4 bg-primary/5 rounded-md border border-primary/10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <span className="font-semibold text-foreground">GRAFTT Guarantee includes:</span>
                      <span className="text-muted-foreground"> Verified licenses, price protection, and dedicated support if anything goes wrong.</span>
                    </div>
                  </div>
                </motion.div>
              </motion.section>
            )}
            
            {/* Not Yet Verified Section - Quote Request Tier */}
            {notVerifiedProviders.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                data-testid="section-not-verified"
              >
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-amber-500/10 to-amber-500/5 rounded-md -m-4 p-4" />
                  <div className="relative flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                        <FileQuestion className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-foreground">Request a Quote</h2>
                        <p className="text-sm text-muted-foreground">These providers haven't completed verification yet</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">
                        <Clock className="w-3 h-3 mr-1" />
                        {notVerifiedProviders.length} Pending
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4 relative">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-500 via-amber-500/50 to-amber-500/20 rounded-full" />
                  <div className="pl-6">
                    {notVerifiedProviders.map((provider, index) => {
                      const price = getProviderPrice(provider, size || '6yd', items, placement || 'driveway');
                      const totals = calculateTotals(size || '6yd', items, placement || 'driveway', itemQuantities);
                      const providerBasePrice = provider.priceBySize[size as keyof typeof provider.priceBySize] || provider.priceBySize['6yd'];
                      
                      return (
                        <ProviderCard
                          key={provider.id}
                          provider={provider}
                          price={price}
                          selected={providerId === provider.id}
                          onSelect={() => handleSelectProvider(provider.id)}
                          onRequestQuote={() => handleRequestQuote(provider.id)}
                          index={index}
                          basePrice={providerBasePrice}
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
                </div>
                
                <motion.div 
                  className="mt-4 p-4 bg-amber-500/5 rounded-md border border-amber-500/10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <span className="font-semibold text-foreground">Why request a quote?</span>
                      <span className="text-muted-foreground"> These providers are new to GRAFTT. Request a quote and we'll verify their credentials before you commit.</span>
                    </div>
                  </div>
                </motion.div>
              </motion.section>
            )}
            
            {/* Not GRAFTT Guaranteed Section - Warning Tier */}
            {notGuaranteedProviders.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                data-testid="section-not-guaranteed"
              >
                <div className="border border-border rounded-md overflow-hidden">
                  <button
                    onClick={() => setShowNotGuaranteed(!showNotGuaranteed)}
                    className="w-full p-4 flex items-center justify-between gap-4 bg-muted/30 hover:bg-muted/50 transition-colors"
                    data-testid="button-toggle-not-guaranteed"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <h2 className="text-base font-semibold text-muted-foreground">Other Providers</h2>
                          <Badge variant="secondary" className="text-xs">
                            {notGuaranteedProviders.length}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">Not covered by GRAFTT Guarantee</p>
                      </div>
                    </div>
                    <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${showNotGuaranteed ? 'rotate-90' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {showNotGuaranteed && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 pt-0 space-y-4">
                          <div className="p-3 bg-destructive/5 rounded-md border border-destructive/10 mt-4">
                            <div className="flex items-start gap-3">
                              <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                              <p className="text-xs text-muted-foreground">
                                <span className="font-semibold text-foreground">Proceed with caution.</span> These providers are not verified by GRAFTT and are not covered by our guarantee. We recommend choosing a GRAFTT Guaranteed provider.
                              </p>
                            </div>
                          </div>
                          
                          {notGuaranteedProviders.map((provider, index) => {
                            const price = getProviderPrice(provider, size || '6yd', items, placement || 'driveway');
                            const totals = calculateTotals(size || '6yd', items, placement || 'driveway', itemQuantities);
                            const providerBasePrice = provider.priceBySize[size as keyof typeof provider.priceBySize] || provider.priceBySize['6yd'];
                            
                            return (
                              <ProviderCard
                                key={provider.id}
                                provider={provider}
                                price={price}
                                selected={providerId === provider.id}
                                onSelect={() => handleSelectProvider(provider.id)}
                                index={index}
                                basePrice={providerBasePrice}
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
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.section>
            )}
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
      </motion.main>
    </div>
  );
}
