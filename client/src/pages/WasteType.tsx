import { useLocation } from 'wouter';
import { Home as HomeIcon, Hammer, Trees, Mountain, Wrench } from 'lucide-react';
import Header from '@/components/Header';
import ProgressRibbon from '@/components/ProgressRibbon';
import EducationPill from '@/components/EducationPill';
import Tile from '@/components/Tile';
import { useJourneyStore } from '@/store/journeyStore';
import { motion } from 'framer-motion';

const wasteTypes = [
  { id: 'house', label: 'House clearance', description: 'Mixed general waste', icon: HomeIcon },
  { id: 'renovation', label: 'Renovation', description: 'Builders\' waste', icon: Hammer },
  { id: 'garden', label: 'Garden makeover', description: 'Green waste', icon: Trees },
  { id: 'soil', label: 'Soil & Rubble', description: 'Soil & stone', icon: Mountain },
  { id: 'diy', label: 'DIY Woodwork', description: 'Wood waste', icon: Wrench },
];

export default function WasteType() {
  const [, setLocation] = useLocation();
  const { wasteType, setWasteType } = useJourneyStore();
  
  const handleSelect = (type: string) => {
    setWasteType(type);
    setTimeout(() => setLocation('/items'), 200);
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
          
          <EducationPill text="The right category keeps costs fair and increases recycling." />
        </div>
      </motion.main>
    </div>
  );
}
