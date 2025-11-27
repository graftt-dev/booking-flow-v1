import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import ProgressRibbon from '@/components/ProgressRibbon';
import EducationPill from '@/components/EducationPill';
import { useJourneyStore } from '@/store/journeyStore';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Truck, Package, ArrowRight, Info, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addDays, addMonths, subMonths, differenceInDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isSameMonth, isAfter, isBefore } from 'date-fns';

type SelectionPhase = 'delivery' | 'collection';
type DateMode = 'specific' | 'flexible';

export default function DeliveryDate() {
  const [, setLocation] = useLocation();
  const { setDeliveryDate, setCollectionDate, size } = useJourneyStore();
  const [phase, setPhase] = useState<SelectionPhase>('delivery');
  const [deliveryMode, setDeliveryMode] = useState<DateMode>('specific');
  const [collectionMode, setCollectionMode] = useState<DateMode>('specific');
  
  const [deliveryStart, setDeliveryStart] = useState<Date | undefined>();
  const [deliveryEnd, setDeliveryEnd] = useState<Date | undefined>();
  const [collectionStart, setCollectionStart] = useState<Date | undefined>();
  const [collectionEnd, setCollectionEnd] = useState<Date | undefined>();
  
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const today = new Date();
  const tomorrow = addDays(today, 1);

  const currentMode = phase === 'delivery' ? deliveryMode : collectionMode;
  const setCurrentMode = phase === 'delivery' ? setDeliveryMode : setCollectionMode;

  const handleDateClick = (date: Date) => {
    if (phase === 'delivery') {
      if (deliveryMode === 'specific') {
        setDeliveryStart(date);
        setDeliveryEnd(undefined);
        setDeliveryDate(format(date, 'yyyy-MM-dd'));
        setPhase('collection');
      } else {
        if (!deliveryStart || (deliveryStart && deliveryEnd)) {
          setDeliveryStart(date);
          setDeliveryEnd(undefined);
        } else {
          if (isBefore(date, deliveryStart)) {
            setDeliveryEnd(deliveryStart);
            setDeliveryStart(date);
          } else {
            setDeliveryEnd(date);
          }
          setDeliveryDate(`${format(deliveryStart, 'yyyy-MM-dd')}|${format(date, 'yyyy-MM-dd')}`);
          setPhase('collection');
        }
      }
    } else {
      if (collectionMode === 'specific') {
        setCollectionStart(date);
        setCollectionEnd(undefined);
        setCollectionDate(format(date, 'yyyy-MM-dd'));
      } else {
        if (!collectionStart || (collectionStart && collectionEnd)) {
          setCollectionStart(date);
          setCollectionEnd(undefined);
        } else {
          if (isBefore(date, collectionStart)) {
            setCollectionEnd(collectionStart);
            setCollectionStart(date);
          } else {
            setCollectionEnd(date);
          }
          setCollectionDate(`${format(collectionStart, 'yyyy-MM-dd')}|${format(date, 'yyyy-MM-dd')}`);
        }
      }
    }
  };

  const handleChangeDelivery = () => {
    setPhase('delivery');
    setCollectionStart(undefined);
    setCollectionEnd(undefined);
  };

  const handleContinue = () => {
    const hasDelivery = deliveryStart;
    const hasCollection = collectionStart;
    if (hasDelivery && hasCollection) {
      setLocation('/finding-providers');
    }
  };

  const getHireDays = () => {
    const dStart = deliveryEnd || deliveryStart;
    const cStart = collectionStart;
    if (dStart && cStart) {
      return differenceInDays(cStart, dStart);
    }
    return 0;
  };

  const canContinue = deliveryStart && collectionStart;
  const effectiveDeliveryEnd = deliveryEnd || deliveryStart;
  const collectionMinDate = effectiveDeliveryEnd ? addDays(effectiveDeliveryEnd, 1) : addDays(tomorrow, 1);

  const isDateDisabled = (date: Date) => {
    if (phase === 'delivery') {
      return isBefore(date, tomorrow);
    }
    return isBefore(date, collectionMinDate);
  };

  const getDayClasses = (date: Date) => {
    const disabled = isDateDisabled(date);
    if (disabled) return 'text-muted-foreground/40 cursor-not-allowed';

    const isDeliveryStart = deliveryStart && isSameDay(date, deliveryStart);
    const isDeliveryEnd = deliveryEnd && isSameDay(date, deliveryEnd);
    const isCollectionStart = collectionStart && isSameDay(date, collectionStart);
    const isCollectionEnd = collectionEnd && isSameDay(date, collectionEnd);
    
    const isInDeliveryFlex = deliveryStart && deliveryEnd && 
      isAfter(date, deliveryStart) && isBefore(date, deliveryEnd);
    const isInCollectionFlex = collectionStart && collectionEnd && 
      isAfter(date, collectionStart) && isBefore(date, collectionEnd);
    
    const effectiveDelivery = deliveryEnd || deliveryStart;
    const effectiveCollection = collectionStart;
    const isInHirePeriod = effectiveDelivery && effectiveCollection &&
      isAfter(date, effectiveDelivery) && isBefore(date, effectiveCollection);

    if (isDeliveryStart || isDeliveryEnd || isCollectionStart || isCollectionEnd) {
      return 'bg-primary text-primary-foreground font-semibold';
    }
    
    if (isInDeliveryFlex || isInCollectionFlex) {
      return 'bg-muted text-muted-foreground';
    }
    
    if (isInHirePeriod) {
      return 'bg-primary/20 text-primary';
    }

    return 'hover-elevate text-foreground';
  };

  const renderMonth = (monthDate: Date, isSecondMonth = false) => {
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
    const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

    return (
      <div className="flex-1" data-testid={`calendar-month-${isSecondMonth ? 'next' : 'current'}`}>
        <h3 className="text-center font-semibold text-foreground mb-4">
          {format(monthDate, 'MMMM yyyy')}
        </h3>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day, i) => (
            <div key={i} className="text-center text-xs text-muted-foreground font-medium py-1">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, i) => {
            const isCurrentMonth = isSameMonth(day, monthDate);
            const disabled = isDateDisabled(day);
            const dayClasses = getDayClasses(day);
            
            return (
              <button
                key={i}
                onClick={() => !disabled && isCurrentMonth && handleDateClick(day)}
                disabled={disabled || !isCurrentMonth}
                className={`
                  aspect-square flex items-center justify-center text-sm rounded-full transition-all
                  ${!isCurrentMonth ? 'invisible' : dayClasses}
                `}
                data-testid={`day-${format(day, 'yyyy-MM-dd')}`}
              >
                {format(day, 'd')}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const formatDateDisplay = (start?: Date, end?: Date, includeYear = true) => {
    if (!start) return null;
    const yearFormat = includeYear ? ' yyyy' : '';
    if (end && !isSameDay(start, end)) {
      if (isSameMonth(start, end)) {
        return `${format(start, 'EEE d')} - ${format(end, 'EEE d MMM' + yearFormat)}`;
      }
      return `${format(start, 'EEE d MMM')} - ${format(end, 'EEE d MMM' + yearFormat)}`;
    }
    return format(start, 'EEE d MMM' + yearFormat);
  };

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
        
        <div className="max-w-3xl mx-auto">
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="grid grid-cols-2 border-b border-border">
              <button
                onClick={handleChangeDelivery}
                className={`p-4 text-center transition-all border-b-2 ${
                  phase === 'delivery' 
                    ? 'border-primary bg-primary/5' 
                    : deliveryStart 
                      ? 'border-transparent bg-muted/30 hover-elevate' 
                      : 'border-transparent opacity-50'
                }`}
                data-testid="tab-delivery"
              >
                <div className="flex items-center justify-center gap-2 mb-1">
                  {deliveryStart ? (
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
                {deliveryStart ? (
                  <p className="text-sm font-semibold text-primary">{formatDateDisplay(deliveryStart, deliveryEnd)}</p>
                ) : (
                  <p className="text-xs text-muted-foreground">Select date</p>
                )}
              </button>
              
              <button
                onClick={() => deliveryStart && setPhase('collection')}
                disabled={!deliveryStart}
                className={`p-4 text-center transition-all border-b-2 ${
                  phase === 'collection' 
                    ? 'border-primary bg-primary/5' 
                    : collectionStart 
                      ? 'border-transparent bg-muted/30 hover-elevate' 
                      : 'border-transparent'
                } ${!deliveryStart ? 'opacity-40 cursor-not-allowed' : ''}`}
                data-testid="tab-collection"
              >
                <div className="flex items-center justify-center gap-2 mb-1">
                  {collectionStart ? (
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
                {collectionStart ? (
                  <p className="text-sm font-semibold text-primary">{formatDateDisplay(collectionStart, collectionEnd)}</p>
                ) : (
                  <p className="text-xs text-muted-foreground">{deliveryStart ? 'Select date' : 'After delivery'}</p>
                )}
              </button>
            </div>

            <div className="p-4 border-b border-border bg-muted/30">
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentMode('specific')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    currentMode === 'specific'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background border border-border text-muted-foreground hover-elevate'
                  }`}
                  data-testid={`btn-${phase}-specific`}
                >
                  Specific date
                </button>
                <button
                  onClick={() => setCurrentMode('flexible')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    currentMode === 'flexible'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background border border-border text-muted-foreground hover-elevate'
                  }`}
                  data-testid={`btn-${phase}-flexible`}
                >
                  Flexible dates
                </button>
              </div>
              <p className="text-center text-xs text-muted-foreground mt-2">
                {phase === 'delivery' 
                  ? (currentMode === 'flexible' ? 'Select a range of days you could receive the skip' : 'When should we drop off the skip?')
                  : (currentMode === 'flexible' ? 'Select a range of days you could have it collected' : 'When should we pick it up?')}
              </p>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                  className="p-2 rounded-full hover-elevate"
                  data-testid="btn-prev-month"
                >
                  <ChevronLeft className="w-5 h-5 text-muted-foreground" />
                </button>
                <div className="flex-1" />
                <button
                  onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                  className="p-2 rounded-full hover-elevate"
                  data-testid="btn-next-month"
                >
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
              
              <div className="flex gap-8">
                {renderMonth(currentMonth, false)}
                {renderMonth(addMonths(currentMonth, 1), true)}
              </div>

              <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-border text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-primary" />
                  <span>Selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-muted" />
                  <span>Flexible window</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-primary/20" />
                  <span>Hire period</span>
                </div>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {deliveryStart && collectionStart && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-6 p-4 bg-card border border-border rounded-lg"
                data-testid="confirmation-message"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <Truck className="w-5 h-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Delivery</p>
                      <p className="font-semibold text-foreground text-sm">
                        {deliveryEnd ? `${format(deliveryStart, 'd MMM')} - ${format(deliveryEnd, 'd MMM')}` : format(deliveryStart, 'EEE d MMM')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-center px-4 border-x border-border">
                    <span className="text-2xl font-bold text-primary">{getHireDays()}</span>
                    <span className="text-xs text-muted-foreground ml-1">days</span>
                  </div>
                  
                  <div className="flex items-center gap-3 flex-1 justify-end text-right">
                    <div>
                      <p className="text-xs text-muted-foreground">Collection</p>
                      <p className="font-semibold text-foreground text-sm">
                        {collectionEnd ? `${format(collectionStart, 'd MMM')} - ${format(collectionEnd, 'd MMM')}` : format(collectionStart, 'EEE d MMM')}
                      </p>
                    </div>
                    <Package className="w-5 h-5 text-primary flex-shrink-0" />
                  </div>
                </div>
                
                <p className="text-center text-xs text-muted-foreground mt-3 pt-3 border-t border-border">
                  Standard hire: <span className="font-semibold text-foreground">7-14 days</span> for {size || '6yd'} skips
                </p>
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
