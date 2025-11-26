import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import Header from '@/components/Header';
import ProgressRibbon from '@/components/ProgressRibbon';
import EducationPill from '@/components/EducationPill';
import Chip from '@/components/Chip';
import Tile from '@/components/Tile';
import { useJourneyStore } from '@/store/journeyStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, Zap, ArrowLeft, Truck, Package, CalendarRange } from 'lucide-react';
import { format, addDays, differenceInDays } from 'date-fns';
import type { DateRange } from 'react-day-picker';

type DateOption = 'asap' | 'choose-date' | 'flexible' | null;

export default function DeliveryDate() {
  const [, setLocation] = useLocation();
  const { deliveryDate, setDeliveryDate, collectionDate, setCollectionDate } = useJourneyStore();
  const [showCollection, setShowCollection] = useState(false);
  const [deliveryOption, setDeliveryOption] = useState<DateOption>(null);
  const [collectionOption, setCollectionOption] = useState<DateOption>(null);
  const [selectedDeliveryDate, setSelectedDeliveryDate] = useState<Date | undefined>(deliveryDate ? new Date(deliveryDate) : undefined);
  const [selectedCollectionDate, setSelectedCollectionDate] = useState<Date | undefined>(collectionDate ? new Date(collectionDate) : undefined);
  const [confirmedDeliveryDate, setConfirmedDeliveryDate] = useState<string>(deliveryDate || '');
  const [confirmedCollectionDate, setConfirmedCollectionDate] = useState<string>(collectionDate || '');
  const [deliveryDateRange, setDeliveryDateRange] = useState<DateRange | undefined>();
  const [collectionDateRange, setCollectionDateRange] = useState<DateRange | undefined>();
  const [isDeliveryFlexible, setIsDeliveryFlexible] = useState(false);
  const [isCollectionFlexible, setIsCollectionFlexible] = useState(false);

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
    if (isDeliveryFlexible && deliveryDateRange?.to) {
      return addDays(deliveryDateRange.to, 1);
    }
    if (confirmedDeliveryDate) {
      return addDays(new Date(confirmedDeliveryDate), 1);
    }
    return addDays(tomorrow, 1);
  };
  const collectionMinDate = getCollectionMinDate();
  const collectionWeekDays = getWeekDays(collectionMinDate);

  const handleDeliveryOptionSelect = (option: DateOption) => {
    setDeliveryOption(option);
    setIsDeliveryFlexible(option === 'flexible');
    if (option !== 'flexible') {
      setDeliveryDateRange(undefined);
    }
  };

  const handleDeliveryWeekDaySelect = (dateStr: string) => {
    setConfirmedDeliveryDate(dateStr);
    setDeliveryDate(dateStr);
    setShowCollection(true);
  };

  const handleDeliveryCalendarSelect = (date: Date | undefined) => {
    if (date) {
      const dateStr = format(date, 'yyyy-MM-dd');
      setSelectedDeliveryDate(date);
      setConfirmedDeliveryDate(dateStr);
      setDeliveryDate(dateStr);
      setShowCollection(true);
    }
  };

  const handleDeliveryRangeSelect = (range: DateRange | undefined) => {
    setDeliveryDateRange(range);
    if (range?.from && range?.to) {
      const fromStr = format(range.from, 'yyyy-MM-dd');
      const toStr = format(range.to, 'yyyy-MM-dd');
      setConfirmedDeliveryDate(`${fromStr}|${toStr}`);
      setDeliveryDate(`${fromStr}|${toStr}`);
      setShowCollection(true);
    }
  };

  const handleCollectionOptionSelect = (option: DateOption) => {
    setCollectionOption(option);
    setIsCollectionFlexible(option === 'flexible');
    if (option !== 'flexible') {
      setCollectionDateRange(undefined);
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

  const formatConfirmationDate = (dateStr: string) => {
    if (dateStr.includes('|')) {
      const [from, to] = dateStr.split('|');
      return `${format(new Date(from), 'EEE d')} - ${format(new Date(to), 'EEE d MMM')}`;
    }
    return format(new Date(dateStr), 'EEEE, MMMM d');
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
        
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Truck className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">Delivery Date</h2>
                <p className="text-sm text-muted-foreground">When should we drop off the skip?</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Tile
                icon={Zap}
                title="ASAP"
                description="As soon as possible"
                selected={deliveryOption === 'asap'}
                onClick={() => handleDeliveryOptionSelect('asap')}
                testId="tile-delivery-asap"
              />
              <Tile
                icon={CalendarIcon}
                title="Choose date"
                description="Pick a specific date"
                selected={deliveryOption === 'choose-date'}
                onClick={() => handleDeliveryOptionSelect('choose-date')}
                testId="tile-delivery-choose-date"
              />
              <Tile
                icon={CalendarRange}
                title="I'm flexible"
                description="Pick a date range"
                selected={deliveryOption === 'flexible'}
                onClick={() => handleDeliveryOptionSelect('flexible')}
                testId="tile-delivery-flexible"
              />
            </div>

            <AnimatePresence mode="wait">
              {deliveryOption === 'asap' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex gap-3 justify-center flex-wrap"
                  data-testid="delivery-week-days"
                >
                  {deliveryWeekDays.map((day) => (
                    <Chip
                      key={day.full}
                      selected={confirmedDeliveryDate === day.full}
                      onClick={() => handleDeliveryWeekDaySelect(day.full)}
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
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="flex justify-center"
                  data-testid="delivery-calendar"
                >
                  <div className="rounded-md border border-border p-4 bg-background">
                    <Calendar
                      mode="single"
                      selected={selectedDeliveryDate}
                      onSelect={handleDeliveryCalendarSelect}
                      disabled={(date) => date < tomorrow}
                      className="rounded-md"
                    />
                  </div>
                </motion.div>
              )}

              {deliveryOption === 'flexible' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3"
                  data-testid="delivery-range-calendar"
                >
                  <p className="text-center text-sm text-muted-foreground">
                    Select a start and end date for your delivery window
                  </p>
                  <div className="flex justify-center">
                    <div className="rounded-md border border-border p-4 bg-background">
                      <Calendar
                        mode="range"
                        selected={deliveryDateRange}
                        onSelect={handleDeliveryRangeSelect}
                        disabled={(date) => date < tomorrow}
                        numberOfMonths={1}
                        className="rounded-md"
                      />
                    </div>
                  </div>
                  {deliveryDateRange?.from && deliveryDateRange?.to && (
                    <p className="text-center text-sm font-medium text-primary">
                      Deliver between {format(deliveryDateRange.from, 'EEE d MMM')} and {format(deliveryDateRange.to, 'EEE d MMM')}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {showCollection && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4 }}
                className="space-y-6 pt-6 border-t border-border"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Package className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">Collection Date</h2>
                    <p className="text-sm text-muted-foreground">When should we pick it up?</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Tile
                    icon={Zap}
                    title="ASAP"
                    description="As soon as possible"
                    selected={collectionOption === 'asap'}
                    onClick={() => handleCollectionOptionSelect('asap')}
                    testId="tile-collection-asap"
                  />
                  <Tile
                    icon={CalendarIcon}
                    title="Choose date"
                    description="Pick a specific date"
                    selected={collectionOption === 'choose-date'}
                    onClick={() => handleCollectionOptionSelect('choose-date')}
                    testId="tile-collection-choose-date"
                  />
                  <Tile
                    icon={CalendarRange}
                    title="I'm flexible"
                    description="Pick a date range"
                    selected={collectionOption === 'flexible'}
                    onClick={() => handleCollectionOptionSelect('flexible')}
                    testId="tile-collection-flexible"
                  />
                </div>

                <AnimatePresence mode="wait">
                  {collectionOption === 'asap' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex gap-3 justify-center flex-wrap"
                      data-testid="collection-week-days"
                    >
                      {collectionWeekDays.map((day) => (
                        <Chip
                          key={day.full}
                          selected={confirmedCollectionDate === day.full}
                          onClick={() => handleCollectionWeekDaySelect(day.full)}
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
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="flex justify-center"
                      data-testid="collection-calendar"
                    >
                      <div className="rounded-md border border-border p-4 bg-background">
                        <Calendar
                          mode="single"
                          selected={selectedCollectionDate}
                          onSelect={handleCollectionCalendarSelect}
                          disabled={(date) => date < collectionMinDate}
                          className="rounded-md"
                        />
                      </div>
                    </motion.div>
                  )}

                  {collectionOption === 'flexible' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-3"
                      data-testid="collection-range-calendar"
                    >
                      <p className="text-center text-sm text-muted-foreground">
                        Select a start and end date for your collection window
                      </p>
                      <div className="flex justify-center">
                        <div className="rounded-md border border-border p-4 bg-background">
                          <Calendar
                            mode="range"
                            selected={collectionDateRange}
                            onSelect={handleCollectionRangeSelect}
                            disabled={(date) => date < collectionMinDate}
                            numberOfMonths={1}
                            className="rounded-md"
                          />
                        </div>
                      </div>
                      {collectionDateRange?.from && collectionDateRange?.to && (
                        <p className="text-center text-sm font-medium text-primary">
                          Collect between {format(collectionDateRange.from, 'EEE d MMM')} and {format(collectionDateRange.to, 'EEE d MMM')}
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {confirmedDeliveryDate && confirmedCollectionDate && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center p-4 bg-primary/5 rounded-md border border-primary/20"
                data-testid="confirmation-message"
              >
                <p className="text-foreground font-medium">
                  Delivery: {formatConfirmationDate(confirmedDeliveryDate)} — Collection: {formatConfirmationDate(confirmedCollectionDate)}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {getHireDays() > 0 ? `Approximately ${getHireDays()} day hire period` : 'Hire period will be confirmed'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-center items-center gap-4 pt-4">
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
          
          <EducationPill text="Being flexible with dates can help providers offer better availability and pricing." />
        </div>
      </motion.main>
    </div>
  );
}
