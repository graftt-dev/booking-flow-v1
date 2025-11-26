import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import Header from '@/components/Header';
import ProgressRibbon from '@/components/ProgressRibbon';
import EducationPill from '@/components/EducationPill';
import { useJourneyStore } from '@/store/journeyStore';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Truck, Package, ArrowRight, Info, Check } from 'lucide-react';
import { format, addDays, differenceInDays } from 'date-fns';

type SelectionPhase = 'delivery' | 'collection';

export default function DeliveryDate() {
  const [, setLocation] = useLocation();
  const { setDeliveryDate, setCollectionDate, size } = useJourneyStore();
  const [phase, setPhase] = useState<SelectionPhase>('delivery');
  const [deliveryDate, setLocalDeliveryDate] = useState<Date | undefined>();
  const [collectionDate, setLocalCollectionDate] = useState<Date | undefined>();

  const today = new Date();
  const tomorrow = addDays(today, 1);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    if (phase === 'delivery') {
      setLocalDeliveryDate(date);
      setDeliveryDate(format(date, 'yyyy-MM-dd'));
      setPhase('collection');
    } else {
      setLocalCollectionDate(date);
      setCollectionDate(format(date, 'yyyy-MM-dd'));
    }
  };

  const handleChangeDelivery = () => {
    setPhase('delivery');
    setLocalCollectionDate(undefined);
  };

  const handleContinue = () => {
    if (deliveryDate && collectionDate) {
      setLocation('/finding-providers');
    }
  };

  const getHireDays = () => {
    if (deliveryDate && collectionDate) {
      return differenceInDays(collectionDate, deliveryDate);
    }
    return 0;
  };

  const canContinue = deliveryDate && collectionDate;
  const collectionMinDate = deliveryDate ? addDays(deliveryDate, 1) : addDays(tomorrow, 1);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="container mx-auto px-4 py-8"
      >
        <h1 className="text-4xl font-bold text-foreground text-center mb-2" data-testid="text-page-title">
          When do you need the skip?
        </h1>
        
        <p className="text-center text-muted-foreground mb-4" data-testid="text-subtext">
          Select your delivery and collection dates
        </p>
        
        <ProgressRibbon currentStep={3} />
        
        <div className="max-w-md mx-auto">
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="grid grid-cols-2">
              <button
                onClick={handleChangeDelivery}
                className={`p-4 text-center transition-all border-b-2 ${
                  phase === 'delivery' 
                    ? 'border-primary bg-primary/5' 
                    : deliveryDate 
                      ? 'border-transparent bg-muted/30 hover-elevate' 
                      : 'border-transparent opacity-50'
                }`}
                data-testid="tab-delivery"
              >
                <div className="flex items-center justify-center gap-2 mb-1">
                  {deliveryDate ? (
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                  ) : (
                    <Truck className={`w-5 h-5 ${phase === 'delivery' ? 'text-primary' : 'text-muted-foreground'}`} />
                  )}
                  <span className={`font-medium ${phase === 'delivery' ? 'text-foreground' : 'text-muted-foreground'}`}>
                    Delivery
                  </span>
                </div>
                {deliveryDate ? (
                  <p className="text-sm font-semibold text-primary">{format(deliveryDate, 'EEE d MMM')}</p>
                ) : (
                  <p className="text-xs text-muted-foreground">Select date</p>
                )}
              </button>
              
              <button
                onClick={() => deliveryDate && setPhase('collection')}
                disabled={!deliveryDate}
                className={`p-4 text-center transition-all border-b-2 ${
                  phase === 'collection' 
                    ? 'border-primary bg-primary/5' 
                    : collectionDate 
                      ? 'border-transparent bg-muted/30 hover-elevate' 
                      : 'border-transparent'
                } ${!deliveryDate ? 'opacity-40 cursor-not-allowed' : ''}`}
                data-testid="tab-collection"
              >
                <div className="flex items-center justify-center gap-2 mb-1">
                  {collectionDate ? (
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                  ) : (
                    <Package className={`w-5 h-5 ${phase === 'collection' ? 'text-primary' : 'text-muted-foreground'}`} />
                  )}
                  <span className={`font-medium ${phase === 'collection' ? 'text-foreground' : 'text-muted-foreground'}`}>
                    Collection
                  </span>
                </div>
                {collectionDate ? (
                  <p className="text-sm font-semibold text-primary">{format(collectionDate, 'EEE d MMM')}</p>
                ) : (
                  <p className="text-xs text-muted-foreground">{deliveryDate ? 'Select date' : 'After delivery'}</p>
                )}
              </button>
            </div>

            <div className="p-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={phase}
                  initial={{ opacity: 0, x: phase === 'delivery' ? -10 : 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: phase === 'delivery' ? 10 : -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="text-center text-sm text-muted-foreground mb-3">
                    {phase === 'delivery' 
                      ? 'When should we drop off the skip?' 
                      : 'When should we pick it up?'}
                  </p>
                  <Calendar
                    mode="single"
                    selected={phase === 'delivery' ? deliveryDate : collectionDate}
                    onSelect={handleDateSelect}
                    disabled={(date) => date < (phase === 'delivery' ? tomorrow : collectionMinDate)}
                    className="rounded-md mx-auto"
                    data-testid={`calendar-${phase}`}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <AnimatePresence>
            {deliveryDate && collectionDate && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-4 space-y-3"
              >
                <div 
                  className="p-4 bg-primary/5 rounded-lg border border-primary/20"
                  data-testid="confirmation-message"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">{format(deliveryDate, 'EEE d MMM')}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">{format(collectionDate, 'EEE d MMM')}</span>
                    </div>
                  </div>
                  <p className="text-center text-primary font-semibold mt-2">
                    {getHireDays()} day hire
                  </p>
                </div>

                <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg text-xs text-muted-foreground">
                  <Info className="w-4 h-4 mt-0.5 shrink-0" />
                  <p>
                    Most providers include <span className="font-semibold text-foreground">7 days</span> hire for a {size || '6yd'} skip as standard. 
                    Extra days may have additional charges.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-center items-center gap-4 mt-6">
            <Button
              variant="ghost"
              onClick={() => setLocation('/waste')}
              data-testid="button-back"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button 
              size="lg" 
              onClick={handleContinue}
              disabled={!canContinue}
              data-testid="button-continue"
            >
              Continue
            </Button>
          </div>
          
          <div className="mt-6">
            <EducationPill text="Need longer? You can extend your hire when choosing a provider." />
          </div>
        </div>
      </motion.main>
    </div>
  );
}
