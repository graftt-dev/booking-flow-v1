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
import { Calendar as CalendarIcon, Clock, Zap } from 'lucide-react';
import { format, addDays, startOfWeek } from 'date-fns';

type DeliveryOption = 'asap' | 'this-week' | 'choose-date' | null;

export default function DeliveryDate() {
  const [, setLocation] = useLocation();
  const { deliveryDate, setDeliveryDate } = useJourneyStore();
  const [selectedOption, setSelectedOption] = useState<DeliveryOption>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(deliveryDate ? new Date(deliveryDate) : undefined);
  const [confirmedDate, setConfirmedDate] = useState<string>(deliveryDate);

  const today = new Date();
  const tomorrow = addDays(today, 1);
  const weekDays = Array.from({ length: 5 }, (_, i) => {
    const date = addDays(tomorrow, i);
    return {
      date,
      label: format(date, 'EEE'),
      day: format(date, 'd'),
      full: format(date, 'yyyy-MM-dd')
    };
  });

  const handleOptionSelect = (option: DeliveryOption) => {
    setSelectedOption(option);
    setConfirmedDate('');
    
    if (option === 'asap') {
      const asapDate = format(addDays(today, 1), 'yyyy-MM-dd');
      setConfirmedDate(asapDate);
      setDeliveryDate(asapDate);
    }
  };

  const handleWeekDaySelect = (dateStr: string) => {
    setConfirmedDate(dateStr);
    setDeliveryDate(dateStr);
  };

  const handleCalendarSelect = (date: Date | undefined) => {
    if (date) {
      const dateStr = format(date, 'yyyy-MM-dd');
      setSelectedDate(date);
      setConfirmedDate(dateStr);
      setDeliveryDate(dateStr);
    }
  };

  const handleContinue = () => {
    if (confirmedDate) {
      setLocation('/waste');
    }
  };

  const formatConfirmationDate = (dateStr: string) => {
    return format(new Date(dateStr), 'EEEE, MMMM d, yyyy');
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
          We'll do our best to deliver exactly when you need it.
        </p>
        
        <ProgressRibbon currentStep={1} />
        
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <Tile
              icon={Zap}
              title="ASAP"
              description="As soon as possible"
              selected={selectedOption === 'asap'}
              onClick={() => handleOptionSelect('asap')}
              testId="tile-asap"
            />
            <Tile
              icon={Clock}
              title="Sometime this week"
              description="Pick a day this week"
              selected={selectedOption === 'this-week'}
              onClick={() => handleOptionSelect('this-week')}
              testId="tile-this-week"
            />
            <Tile
              icon={CalendarIcon}
              title="Choose a date"
              description="Pick any date"
              selected={selectedOption === 'choose-date'}
              onClick={() => handleOptionSelect('choose-date')}
              testId="tile-choose-date"
            />
          </div>

          <AnimatePresence mode="wait">
            {selectedOption === 'this-week' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="flex gap-3 justify-center flex-wrap"
                data-testid="week-days-container"
              >
                {weekDays.map((day) => (
                  <Chip
                    key={day.full}
                    selected={confirmedDate === day.full}
                    onClick={() => handleWeekDaySelect(day.full)}
                  >
                    <div className="text-center">
                      <div className="text-xs">{day.label}</div>
                      <div className="font-semibold">{day.day}</div>
                    </div>
                  </Chip>
                ))}
              </motion.div>
            )}

            {selectedOption === 'choose-date' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex justify-center"
                data-testid="calendar-container"
              >
                <div className="rounded-md border border-border p-4 bg-background">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleCalendarSelect}
                    disabled={(date) => date < tomorrow}
                    className="rounded-md"
                    data-testid="calendar"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {confirmedDate && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center p-4 bg-primary/5 rounded-md border border-primary/20"
                data-testid="confirmation-message"
              >
                <p className="text-foreground font-medium">
                  Got it — we'll plan delivery for {formatConfirmationDate(confirmedDate)}.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-center pt-4">
            <Button 
              size="lg" 
              onClick={handleContinue}
              disabled={!confirmedDate}
              data-testid="button-continue"
            >
              Continue
            </Button>
          </div>
          
          <EducationPill text="Choosing your delivery date helps us schedule the right lorry and permit if needed." />
        </div>
      </motion.main>
    </div>
  );
}
