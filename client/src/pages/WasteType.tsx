import { useLocation } from 'wouter';
import { Check, X, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import ProgressRibbon from '@/components/ProgressRibbon';
import EducationPill from '@/components/EducationPill';
import { useJourneyStore } from '@/store/journeyStore';
import { motion } from 'framer-motion';

const wasteTypes = [
  { 
    id: 'mixed', 
    label: 'Mixed General', 
    tag: 'The all-rounder',
    producedIn: 'House clearances, garage clear-outs, office refits',
    includes: ['Wood & timber', 'Furniture', 'Cardboard', 'Plastics'],
    avoids: ['Hazardous materials', 'Electronics', 'Chemicals'],
  },
  { 
    id: 'construction', 
    label: 'Mixed Construction', 
    tag: 'Construction debris',
    producedIn: 'Demolitions, extensions, bathroom/kitchen refits',
    includes: ['Bricks & blocks', 'Tiles', 'Concrete', 'Stone'],
    avoids: ['Plasterboard', 'Asbestos', 'Large soil volumes'],
  },
  { 
    id: 'soil', 
    label: 'Soil & Stone', 
    tag: 'Groundworks',
    producedIn: 'Excavations, landscaping, foundation digging',
    includes: ['Clean soil', 'Clay', 'Sand', 'Small stones'],
    avoids: ['Contaminated soil', 'Green waste', 'Mixed waste'],
  },
  { 
    id: 'garden', 
    label: 'Green & Garden', 
    tag: 'Garden projects',
    producedIn: 'Garden makeovers, hedge trimming, tree surgery',
    includes: ['Grass & turf', 'Branches', 'Shrubs', 'Leaves'],
    avoids: ['Soil volumes', 'Pots & planters', 'Treated timber'],
  },
  { 
    id: 'wood', 
    label: 'Wood', 
    tag: 'Timber & fencing',
    producedIn: 'Fencing, decking removals, shed demolitions',
    includes: ['Untreated timber', 'Chipboard', 'Pallets', 'Plywood'],
    avoids: ['Treated wood', 'Railway sleepers', 'Painted wood'],
  },
  { 
    id: 'plasterboard', 
    label: 'Plasterboard', 
    tag: 'Walls & ceilings',
    producedIn: 'Wall demolitions, ceiling removals, loft conversions',
    includes: ['Plasterboard sheets', 'Drywall', 'Gypsum boards'],
    avoids: ['Mixed waste', 'Insulation', 'Artex (asbestos risk)'],
  },
];

export default function WasteType() {
  const [, setLocation] = useLocation();
  const { wasteType, setWasteType } = useJourneyStore();
  
  const handleSelect = (type: string) => {
    setWasteType(type);
  };

  const handleContinue = () => {
    if (wasteType) {
      setLocation('/delivery-date');
    }
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
          What type of waste is it?
        </h1>
        
        <ProgressRibbon currentStep={2} />
        
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {wasteTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => handleSelect(type.id)}
                className={`
                  text-left rounded-md border-2 transition-all relative overflow-hidden
                  ${wasteType === type.id 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border bg-background hover-elevate'
                  }
                `}
                data-testid={`tile-${type.id}`}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-lg font-bold text-foreground">{type.label}</h3>
                    <span className="px-2 py-1 text-xs font-medium bg-secondary text-muted-foreground rounded-full whitespace-nowrap flex-shrink-0">
                      {type.tag}
                    </span>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-3">{type.producedIn}</p>
                  
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-1 mb-1">
                        <Check className="w-3 h-3 text-primary" />
                        <span className="text-xs font-semibold text-foreground">Includes</span>
                      </div>
                      {type.includes.map((item, idx) => (
                        <p key={idx} className="text-xs text-muted-foreground">• {item}</p>
                      ))}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-1 mb-1">
                        <X className="w-3 h-3 text-destructive" />
                        <span className="text-xs font-semibold text-foreground">Avoids</span>
                      </div>
                      {type.avoids.map((item, idx) => (
                        <p key={idx} className="text-xs text-muted-foreground">• {item}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="flex justify-center items-center gap-4 mt-8">
            <Button
              variant="ghost"
              onClick={() => setLocation('/size')}
              data-testid="button-back"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button
              size="lg"
              onClick={handleContinue}
              disabled={!wasteType}
              data-testid="button-continue"
            >
              Continue
            </Button>
          </div>
          
          <EducationPill text="The right category keeps costs fair and increases recycling." />
        </div>
      </motion.main>
    </div>
  );
}
