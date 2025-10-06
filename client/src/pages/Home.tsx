import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import SearchBar from '@/components/SearchBar';
import { useJourneyStore } from '@/store/journeyStore';
import Header from '@/components/Header';
import { motion } from 'framer-motion';

export default function Home() {
  const [, setLocation] = useLocation();
  const { postcode, setPostcode, setOnRoadFromHome } = useJourneyStore();
  const [onRoad, setOnRoad] = useState(false);
  
  const handleGetStarted = () => {
    setLocation('/location');
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-16"
      >
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground tracking-tight" data-testid="text-hero-title">
              The easiest way to hire a skip.
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="text-hero-subtitle">
              Skip hire you can trust – no cowboys, no fly-tipping, no fines.
            </p>
            <p className="text-sm font-medium text-primary" data-testid="text-benchmark">
              UK's No.1 Marketplace for Skip Hire
            </p>
          </div>
          
          <div className="space-y-6 pt-8">
            <SearchBar
              value={postcode}
              onChange={setPostcode}
              placeholder="Enter postcode or address"
            />
            
            <div className="flex items-center justify-center gap-3">
              <Switch
                checked={onRoad}
                onCheckedChange={(checked) => {
                  setOnRoad(checked);
                  setOnRoadFromHome(checked);
                }}
                data-testid="switch-on-road"
              />
              <label className="text-sm text-muted-foreground cursor-pointer">
                On the road?
              </label>
            </div>
            
            <Button 
              size="lg" 
              className="px-12 h-12 text-lg"
              onClick={handleGetStarted}
              data-testid="button-get-started"
            >
              Get started
            </Button>
          </div>
        </div>
      </motion.main>
    </div>
  );
}
