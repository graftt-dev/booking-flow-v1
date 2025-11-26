import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import Header from '@/components/Header';
import ProgressRibbon from '@/components/ProgressRibbon';
import EducationPill from '@/components/EducationPill';
import Chip from '@/components/Chip';
import { useJourneyStore } from '@/store/journeyStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, Zap, ArrowLeft, Truck, Package, CalendarRange, Info } from 'lucide-react';
import { format, addDays, differenceInDays } from 'date-fns';
import type { DateRange } from 'react-day-picker';

type DateOption = 'asap' | 'choose-date' | 'flexible' | null;

const optionButtons = [
  { id: 'asap', icon: Zap, label: 'ASAP' },
  { id: 'choose-date', icon: CalendarIcon, label: 'Specific date' },
  { id: 'flexible', icon: CalendarRange, label: 'Flexible' },
] as const;

export default function DeliveryDate() {
  const [, setLocation] = useLocation();
  const { deliveryDate, setDeliveryDate, collectionDate, setCollectionDate, size } = useJourneyStore();
  const [deliveryOption, setDeliveryOption] = useState<DateOption>(null);
  const [collectionOption, setCollectionOption] = useState<DateOption>(null);
  
  const parseInitialDate = (dateStr: string | undefined): Date | undefined => {
    if (!dateStr) return undefined;
    if (dateStr.includes('|')) return undefined;
    try {
      return new Date(dateStr);
    } catch {
      return undefined;
    }
  };
  
  const [selectedDeliveryDate, setSelectedDeliveryDate] = useState<Date | undefined>(parseInitialDate(deliveryDate));
  const [selectedCollectionDate, setSelectedCollectionDate] = useState<Date | undefined>(parseInitialDate(collectionDate));
  const [confirmedDeliveryDate, setConfirmedDeliveryDate] = useState<string>(deliveryDate || '');
  const [confirmedCollectionDate, setConfirmedCollectionDate] = useState<string>(collectionDate || '');
  const [deliveryDateRange, setDeliveryDateRange] = useState<DateRange | undefined>();
  const [collectionDateRange, setCollectionDateRange] = useState<DateRange | undefined>();

  const today = new Date();
  const tomorrow = addDays(today, 1);
  
  const getWeekDays = (startDate: Date) => Array.from({ length: 5 }, (_, i) => {
    const date = addDays(startDate, i);
    return {
      date,
      label: format(date, 'EEE'),
      day: format(date, 'd'),
      full: format(date, 'yyyy-MM-dd')
    };
  });

  const deliveryWeekDays = getWeekDays(tomorrow);
  const getCollectionMinDate = () => {
    if (deliveryOption === 'flexible' && deliveryDateRange?.to) {
      return addDays(deliveryDateRange.to, 1);
    }
    if (confirmedDeliveryDate && !confirmedDeliveryDate.includes('|')) {
      return addDays(new Date(confirmedDeliveryDate), 1);
    }
    return addDays(tomorrow, 1);
  };
  const collectionMinDate = getCollectionMinDate();
  const collectionWeekDays = getWeekDays(collectionMinDate);

  const handleDeliveryWeekDaySelect = (dateStr: string) => {
    setConfirmedDeliveryDate(dateStr);
    setDeliveryDate(dateStr);
  };

  const handleDeliveryCalendarSelect = (date: Date | undefined) => {
    if (date) {
      const dateStr = format(date, 'yyyy-MM-dd');
      setSelectedDeliveryDate(date);
      setConfirmedDeliveryDate(dateStr);
      setDeliveryDate(dateStr);
    }
  };

  const handleDeliveryRangeSelect = (range: DateRange | undefined) => {
    setDeliveryDateRange(range);
    if (range?.from && range?.to) {
      const fromStr = format(range.from, 'yyyy-MM-dd');
      const toStr = format(range.to, 'yyyy-MM-dd');
      setConfirmedDeliveryDate(`${fromStr}|${toStr}`);
      setDeliveryDate(`${fromStr}|${toStr}`);
    }
  };

  const handleCollectionWeekDaySelect = (dateStr: string) => {
    setConfirmedCollectionDate(dateStr);
    setCollectionDate(dateStr);
  };

  const handleCollectionCalendarSelect = (date: Date | undefined) => {
    if (date) {
      const dateStr = format(date, 'yyyy-MM-dd');
      setSelectedCollectionDate(date);
      setConfirmedCollectionDate(dateStr);
      setCollectionDate(dateStr);
    }
  };

  const handleCollectionRangeSelect = (range: DateRange | undefined) => {
    setCollectionDateRange(range);
    if (range?.from && range?.to) {
      const fromStr = format(range.from, 'yyyy-MM-dd');
      const toStr = format(range.to, 'yyyy-MM-dd');
      setConfirmedCollectionDate(`${fromStr}|${toStr}`);
      setCollectionDate(`${fromStr}|${toStr}`);
    }
  };

  const handleContinue = () => {
    if (confirmedDeliveryDate && confirmedCollectionDate) {
      setLocation('/finding-providers');
    }
  };

  const formatDate = (dateStr: string, short = false) => {
    if (dateStr.includes('|')) {
      const [from, to] = dateStr.split('|');
      return `${format(new Date(from), 'EEE d')} - ${format(new Date(to), short ? 'd MMM' : 'EEE d MMM')}`;
    }
    return format(new Date(dateStr), short ? 'EEE d MMM' : 'EEEE d MMMM');
  };

  const getHireDays = () => {
    if (confirmedDeliveryDate && confirmedCollectionDate) {
      const deliveryEnd = confirmedDeliveryDate.includes('|') 
        ? new Date(confirmedDeliveryDate.split('|')[1]) 
        : new Date(confirmedDeliveryDate);
      const collectionStart = confirmedCollectionDate.includes('|')
        ? new Date(confirmedCollectionDate.split('|')[0])
        : new Date(confirmedCollectionDate);
      return differenceInDays(collectionStart, deliveryEnd);
    }
    return 0;
  };

  const canContinue = confirmedDeliveryDate && confirmedCollectionDate;
  const showCollectionSection = deliveryOption && confirmedDeliveryDate;

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
          Choose your delivery and collection dates.
        </p>
        
        <ProgressRibbon currentStep={3} />
        
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">Delivery</h2>
              </div>
              
              <div className="flex gap-2">
                {optionButtons.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setDeliveryOption(opt.id);
                      if (opt.id !== 'flexible') setDeliveryDateRange(undefined);
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md border text-sm font-medium transition-all ${
                      deliveryOption === opt.id
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-background text-muted-foreground hover-elevate'
                    }`}
                    data-testid={`btn-delivery-${opt.id}`}
                  >
                    <opt.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{opt.label}</span>
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {deliveryOption === 'asap' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex gap-2 flex-wrap"
                    data-testid="delivery-week-days"
                  >
                    {deliveryWeekDays.map((day) => (
                      <Chip
                        key={day.full}
                        selected={confirmedDeliveryDate === day.full}
                        onClick={() => handleDeliveryWeekDaySelect(day.full)}
                        className="flex-1 min-w-[60px]"
                      >
                        <div className="text-center">
                          <div className="text-xs">{day.label}</div>
                          <div className="font-semibold">{day.day}</div>
                        </div>
                      </Chip>
                    ))}
                  </motion.div>
                )}

                {deliveryOption === 'choose-date' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    data-testid="delivery-calendar"
                  >
                    <div className="rounded-md border border-border p-3 bg-background">
                      <Calendar
                        mode="single"
                        selected={selectedDeliveryDate}
                        onSelect={handleDeliveryCalendarSelect}
                        disabled={(date) => date < tomorrow}
                        className="rounded-md mx-auto"
                      />
                    </div>
                  </motion.div>
                )}

                {deliveryOption === 'flexible' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-2"
                    data-testid="delivery-range-calendar"
                  >
                    <p className="text-xs text-muted-foreground text-center">Select start and end dates</p>
                    <div className="rounded-md border border-border p-3 bg-background">
                      <Calendar
                        mode="range"
                        selected={deliveryDateRange}
                        onSelect={handleDeliveryRangeSelect}
                        disabled={(date) => date < tomorrow}
                        numberOfMonths={1}
                        className="rounded-md mx-auto"
                      />
                    </div>
                    {deliveryDateRange?.from && deliveryDateRange?.to && (
                      <p className="text-xs font-medium text-primary text-center">
                        {format(deliveryDateRange.from, 'EEE d')} - {format(deliveryDateRange.to, 'EEE d MMM')}
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {showCollectionSection && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-semibold text-foreground">Collection</h2>
                  </div>
                  
                  <div className="flex gap-2">
                    {optionButtons.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setCollectionOption(opt.id);
                          if (opt.id !== 'flexible') setCollectionDateRange(undefined);
                        }}
                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md border text-sm font-medium transition-all ${
                          collectionOption === opt.id
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border bg-background text-muted-foreground hover-elevate'
                        }`}
                        data-testid={`btn-collection-${opt.id}`}
                      >
                        <opt.icon className="w-4 h-4" />
                        <span className="hidden sm:inline">{opt.label}</span>
                      </button>
                    ))}
                  </div>

                  <AnimatePresence mode="wait">
                    {collectionOption === 'asap' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex gap-2 flex-wrap"
                        data-testid="collection-week-days"
                      >
                        {collectionWeekDays.map((day) => (
                          <Chip
                            key={day.full}
                            selected={confirmedCollectionDate === day.full}
                            onClick={() => handleCollectionWeekDaySelect(day.full)}
                            className="flex-1 min-w-[60px]"
                          >
                            <div className="text-center">
                              <div className="text-xs">{day.label}</div>
                              <div className="font-semibold">{day.day}</div>
                            </div>
                          </Chip>
                        ))}
                      </motion.div>
                    )}

                    {collectionOption === 'choose-date' && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        data-testid="collection-calendar"
                      >
                        <div className="rounded-md border border-border p-3 bg-background">
                          <Calendar
                            mode="single"
                            selected={selectedCollectionDate}
                            onSelect={handleCollectionCalendarSelect}
                            disabled={(date) => date < collectionMinDate}
                            className="rounded-md mx-auto"
                          />
                        </div>
                      </motion.div>
                    )}

                    {collectionOption === 'flexible' && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-2"
                        data-testid="collection-range-calendar"
                      >
                        <p className="text-xs text-muted-foreground text-center">Select start and end dates</p>
                        <div className="rounded-md border border-border p-3 bg-background">
                          <Calendar
                            mode="range"
                            selected={collectionDateRange}
                            onSelect={handleCollectionRangeSelect}
                            disabled={(date) => date < collectionMinDate}
                            numberOfMonths={1}
                            className="rounded-md mx-auto"
                          />
                        </div>
                        {collectionDateRange?.from && collectionDateRange?.to && (
                          <p className="text-xs font-medium text-primary text-center">
                            {format(collectionDateRange.from, 'EEE d')} - {format(collectionDateRange.to, 'EEE d MMM')}
                          </p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {confirmedDeliveryDate && confirmedCollectionDate && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="space-y-3"
              >
                <div 
                  className="p-4 bg-primary/5 rounded-md border border-primary/20"
                  data-testid="confirmation-message"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <Truck className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-sm font-medium text-foreground">{formatDate(confirmedDeliveryDate, true)}</span>
                    </div>
                    <div className="hidden sm:block text-muted-foreground">→</div>
                    <div className="flex items-center gap-3">
                      <Package className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-sm font-medium text-foreground">{formatDate(confirmedCollectionDate, true)}</span>
                    </div>
                  </div>
                  <p className="text-center text-sm font-semibold text-primary mt-2">
                    {getHireDays() > 0 ? `${getHireDays()} day hire period` : 'Hire period to be confirmed'}
                  </p>
                </div>
                
                <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-md border border-border">
                  <Info className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <p className="text-xs text-muted-foreground">
                    Most providers include <span className="font-semibold text-foreground">7 days hire</span> for a {size || '6yd'} skip as standard. 
                    Any extra days beyond this may come at an additional cost depending on the provider you choose.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-center items-center gap-4 pt-2">
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
          
          <EducationPill text="Being flexible with dates can help providers offer better availability." />
        </div>
      </motion.main>
    </div>
  );
}
