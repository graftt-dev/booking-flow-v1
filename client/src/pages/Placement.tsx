import { useLocation } from 'wouter';
import { Home, Truck } from 'lucide-react';
import Header from '@/components/Header';
import ProgressRibbon from '@/components/ProgressRibbon';
import EducationPill from '@/components/EducationPill';
import Tile from '@/components/Tile';
import { useJourneyStore } from '@/store/journeyStore';
import { motion } from 'framer-motion';

export default function Placement() {
  const [, setLocation] = useLocation();
  const { placement, setPlacement } = useJourneyStore();
  
  const handleSelect = (value: 'driveway' | 'road') => {
    setPlacement(value);
    setTimeout(() => setLocation('/waste'), 200);
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
          Where should we place the skip?
        </h1>
        
        <ProgressRibbon currentStep={1} />
        
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <Tile
              icon={Home}
              title="On your property"
              description="Driveway, garden, or private land"
              selected={placement === 'driveway'}
              onClick={() => handleSelect('driveway')}
              testId="tile-driveway"
            />
            <Tile
              icon={Truck}
              title="On the road"
              description="May require council permit"
              selected={placement === 'road'}
              onClick={() => handleSelect('road')}
              badge="Permit"
              testId="tile-road"
            />
          </div>
          
          <EducationPill text="Driveway avoids permits and often speeds up delivery." />
        </div>
      </motion.main>
    </div>
  );
}
