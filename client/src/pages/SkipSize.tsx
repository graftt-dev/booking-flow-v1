import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import ProgressRibbon from '@/components/ProgressRibbon';
import EducationPill from '@/components/EducationPill';
import Tile from '@/components/Tile';
import { useJourneyStore, type SkipSize as SkipSizeType } from '@/store/journeyStore';
import { motion } from 'framer-motion';
import { calculateTotals } from '@/lib/pricing';
import { ArrowLeft } from 'lucide-react';

const skipSizes = [
  { 
    id: '4yd', 
    label: '4 yard', 
    bags: '≈ 40 bin bags • 4 cubic yards',
    recommended: false,
    whatFits: [
      'Small bathroom renovation',
      'Garden shed clear-out',
      'Kitchen cabinet removal'
    ],
    fillGuidance: 'Fill to 90% - leave 10-15cm from the top'
  },
  { 
    id: '6yd', 
    label: '6 yard', 
    bags: '≈ 60 bin bags • 6 cubic yards',
    recommended: true,
    whatFits: [
      'Full bathroom refit',
      'Kitchen renovation waste',
      'Garage or loft clearance'
    ],
    fillGuidance: 'Fill to 90% - leave 10-15cm from the top'
  },
  { 
    id: '8yd', 
    label: '8 yard', 
    bags: '≈ 80 bin bags • 8 cubic yards',
    recommended: false,
    whatFits: [
      'Large house clearance',
      'Full garden landscaping',
      'Major renovation project'
    ],
    fillGuidance: 'Fill to 90% - leave 10-15cm from the top'
  },
  { 
    id: '12yd', 
    label: '12 yard', 
    bags: '≈ 120 bin bags • 12 cubic yards',
    recommended: false,
    whatFits: [
      'Complete home refurbishment',
      'Commercial fit-out waste',
      'Large construction projects'
    ],
    fillGuidance: 'Fill to 90% - leave 10-15cm from the top'
  },
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
              <button
                key={skip.id}
                onClick={() => handleSelect(skip.id as SkipSizeType)}
                className={`
                  text-left p-6 rounded-md border-2 transition-all relative
                  ${size === skip.id 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border bg-background hover-elevate'
                  }
                `}
                data-testid={`tile-${skip.id}`}
              >
                {skip.recommended && (
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-full">
                      Recommended
                    </span>
                  </div>
                )}
                
                <h3 className="text-2xl font-bold text-foreground mb-1">
                  {skip.label}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {skip.bags}
                </p>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-2">What fits:</p>
                    <ul className="space-y-1">
                      {skip.whatFits.map((item, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start">
                          <span className="mr-2">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="pt-2 border-t border-border">
                    <p className="text-xs font-medium text-foreground">Space to leave:</p>
                    <p className="text-xs text-muted-foreground mt-1">{skip.fillGuidance}</p>
                  </div>
                </div>
              </button>
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

          <div className="flex justify-center mt-4">
            <Button
              variant="ghost"
              onClick={() => setLocation('/items')}
              data-testid="button-back"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
          
          <EducationPill text="One correct size is cheaper than two smaller ones." />
        </div>
      </motion.main>
    </div>
  );
}
