import { useLocation } from 'wouter';
import { Home as HomeIcon, Hammer, Trees, Mountain, Wrench, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import ProgressRibbon from '@/components/ProgressRibbon';
import EducationPill from '@/components/EducationPill';
import Tile from '@/components/Tile';
import { useJourneyStore } from '@/store/journeyStore';
import { motion } from 'framer-motion';

const wasteTypes = [
  { 
    id: 'house', 
    label: 'House clearance', 
    description: 'Old furniture, carpets, appliances, general household items and mixed rubbish',
    icon: HomeIcon 
  },
  { 
    id: 'renovation', 
    label: 'Renovation', 
    description: 'Bricks, plasterboard, tiles, concrete, timber and other building materials',
    icon: Hammer 
  },
  { 
    id: 'garden', 
    label: 'Garden makeover', 
    description: 'Grass cuttings, branches, hedge trimmings, leaves and soil',
    icon: Trees 
  },
  { 
    id: 'soil', 
    label: 'Soil & Rubble', 
    description: 'Clean soil, stones, rocks, clay and demolition rubble (no mixed waste)',
    icon: Mountain 
  },
  { 
    id: 'diy', 
    label: 'DIY Woodwork', 
    description: 'Untreated timber, wooden pallets, floorboards and offcuts',
    icon: Wrench 
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
      setLocation('/items');
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
        
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {wasteTypes.map((type) => (
              <Tile
                key={type.id}
                icon={type.icon}
                title={type.label}
                description={type.description}
                selected={wasteType === type.id}
                onClick={() => handleSelect(type.id)}
                testId={`tile-${type.id}`}
              />
            ))}
          </div>

          <div className="flex justify-center items-center gap-4 mt-6">
            <Button
              variant="ghost"
              onClick={() => setLocation('/delivery-date')}
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
