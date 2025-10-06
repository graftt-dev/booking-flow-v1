import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import ProgressRibbon from '@/components/ProgressRibbon';
import EducationPill from '@/components/EducationPill';
import Tile from '@/components/Tile';
import { useJourneyStore, type SkipSize as SkipSizeType } from '@/store/journeyStore';
import { motion } from 'framer-motion';
import { calculateTotals } from '@/lib/pricing';

const skipSizes = [
  { id: '4yd', label: '4 yard', bags: '≈40 bags', recommended: false },
  { id: '6yd', label: '6 yard', bags: '≈60 bags', recommended: true },
  { id: '8yd', label: '8 yard', bags: '≈80 bags', recommended: false },
  { id: '12yd', label: '12 yard', bags: '≈120 bags', recommended: false },
];

export default function SkipSize() {
  const [, setLocation] = useLocation();
  const { size, setSize, items, placement, setTotals } = useJourneyStore();
  
  const handleSelect = (sizeId: SkipSizeType) => {
    setSize(sizeId);
    const totals = calculateTotals(sizeId, items, placement || 'driveway');
    setTotals(totals);
  };
  
  const handleContinue = () => {
    if (!size) return;
    setTimeout(() => setLocation('/providers'), 1600);
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
          How much waste do you have?
        </h1>
        
        <ProgressRibbon currentStep={4} />
        
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            {skipSizes.map((skip) => (
              <Tile
                key={skip.id}
                title={skip.label}
                description={skip.bags}
                selected={size === skip.id}
                onClick={() => handleSelect(skip.id as SkipSizeType)}
                badge={skip.recommended ? 'Recommended' : undefined}
                testId={`tile-${skip.id}`}
              />
            ))}
          </div>
          
          <div className="flex justify-center mt-8">
            <Button
              size="lg"
              onClick={handleContinue}
              disabled={!size}
              data-testid="button-continue"
            >
              Continue
            </Button>
          </div>
          
          <EducationPill text="One correct size is cheaper than two smaller ones." />
        </div>
      </motion.main>
    </div>
  );
}
