import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import ProgressRibbon from '@/components/ProgressRibbon';
import EducationPill from '@/components/EducationPill';
import Chip from '@/components/Chip';
import { useJourneyStore } from '@/store/journeyStore';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

export default function Location() {
  const [, setLocation] = useLocation();
  const { postcode, address, lat, lng, setLocation: setJourneyLocation } = useJourneyStore();
  const [position, setPosition] = useState<[number, number]>([lat, lng]);
  
  useEffect(() => {
    setPosition([lat, lng]);
  }, [lat, lng]);
  
  const handleContinue = () => {
    setJourneyLocation(position[0], position[1], 'mock.what3.words');
    setLocation('/placement');
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
          Confirm the location
        </h1>
        
        <ProgressRibbon currentStep={0} />
        
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex gap-3 flex-wrap justify-center">
            <Chip selected>
              {postcode || 'SW1A 1AA'}
            </Chip>
            <Chip selected>
              {address || '10 Downing Street, London'}
            </Chip>
            <Chip onClick={() => console.log('Change location')}>
              Change
            </Chip>
          </div>
          
          <div className="aspect-video rounded-md overflow-hidden border border-border bg-secondary/30 flex items-center justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10" />
            <div className="relative text-center space-y-4">
              <MapPin className="w-16 h-16 text-primary mx-auto" />
              <div>
                <p className="text-lg font-semibold text-foreground">Interactive Map</p>
                <p className="text-sm text-muted-foreground">Drag pin to adjust location</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Lat: {position[0].toFixed(4)}, Lng: {position[1].toFixed(4)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center">
            <Button size="lg" onClick={handleContinue} data-testid="button-continue">
              Continue
            </Button>
          </div>
          
          <EducationPill text="Exact location prevents access issues and speeds up delivery." />
        </div>
      </motion.main>
    </div>
  );
}
