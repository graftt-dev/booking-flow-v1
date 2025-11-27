import { useLocation } from 'wouter';
import { Check, X, Info, Eye, ArrowLeft } from 'lucide-react';
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
    producedIn: ['House clearances', 'Garage clear-outs', 'Light renovations', 'Office refits'],
    commonMaterials: ['Wood & timber', 'Furniture & textiles', 'Non-hazardous DIY waste', 'Cardboard & paper', 'Plastics & packaging', 'Small metals'],
    materialsToAvoid: ['Large volumes of soil/rubble', 'Asbestos or hazardous materials', 'Paints, solvents & chemicals', 'Pure plasterboard loads', 'Batteries & electronics', 'Gas cylinders'],
    tip: 'Perfect when your waste is a mix of different materials from a typical clearance.'
  },
  { 
    id: 'construction', 
    label: 'Mixed Construction', 
    tag: 'Construction debris',
    producedIn: ['Building demolitions', 'Extension works', 'Bathroom/kitchen refits', 'Driveway removals'],
    commonMaterials: ['Bricks & blocks', 'Tiles & ceramics', 'Sand & gravel', 'Concrete & hardcore', 'Stone & slate'],
    materialsToAvoid: ['Plasterboard (requires separate)', 'Large soil volumes', 'Hazardous substances', 'Asbestos materials', 'Mixed general waste'],
    tip: 'Weight limits apply - heavy materials fill up fast. Consider a smaller skip.'
  },
  { 
    id: 'soil', 
    label: 'Soil & Stone', 
    tag: 'Groundworks specialist',
    producedIn: ['Garden excavations', 'Foundation digging', 'Landscaping projects', 'Pond installations'],
    commonMaterials: ['Clean soil & earth', 'Clay & subsoil', 'Sand', 'Turf & topsoil', 'Small stones & gravel'],
    materialsToAvoid: ['Contaminated soil', 'Green waste & roots', 'Any mixed waste', 'Concrete & hardcore', 'Building materials'],
    tip: 'Inert soil streams are often cheaper - keep it pure for best rates.'
  },
  { 
    id: 'garden', 
    label: 'Green & Garden', 
    tag: 'Garden projects',
    producedIn: ['Garden makeovers', 'Hedge trimming', 'Tree surgery', 'Lawn renovations'],
    commonMaterials: ['Grass & turf', 'Branches & twigs', 'Shrubs & bushes', 'Hedge clippings', 'Leaves & plants'],
    materialsToAvoid: ['Large soil volumes', 'Invasive species (Japanese knotweed)', 'Pots & planters', 'Food waste', 'Treated timber'],
    tip: 'Keep it green only - mixing in soil or pots changes the waste classification.'
  },
  { 
    id: 'wood', 
    label: 'Wood', 
    tag: 'Timber & fencing',
    producedIn: ['Fencing replacements', 'Decking removals', 'Shed demolitions', 'Flooring projects'],
    commonMaterials: ['Untreated timber', 'Chipboard & MDF', 'Wooden furniture', 'Pallets & crates', 'Plywood sheets'],
    materialsToAvoid: ['Creosoted/treated wood', 'Mixed waste materials', 'Railway sleepers', 'Painted hazardous coatings', 'MDF with bonded materials'],
    tip: 'Separating wood from mixed waste often reduces your disposal costs.'
  },
  { 
    id: 'plasterboard', 
    label: 'Plasterboard', 
    tag: 'Walls & ceilings',
    producedIn: ['Ceiling removals', 'Wall demolitions', 'Partition changes', 'Loft conversions'],
    commonMaterials: ['Plasterboard sheets', 'Drywall sections', 'Plaster & skim', 'Gypsum boards', 'Ceiling tiles (gypsum)'],
    materialsToAvoid: ['Mixed general waste', 'Insulation materials', 'Artex (may contain asbestos)', 'Wet or mouldy plasterboard', 'Metal frames & fixings'],
    tip: 'Plasterboard must be segregated by law - mixing it incurs extra charges.'
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
        
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {wasteTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => handleSelect(type.id)}
                className={`
                  text-left rounded-md border-2 transition-all relative overflow-hidden flex flex-col
                  ${wasteType === type.id 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border bg-background hover-elevate'
                  }
                `}
                data-testid={`tile-${type.id}`}
              >
                <div className="p-4 flex-1">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="text-xl font-bold text-foreground">{type.label}</h3>
                    <span className="px-2 py-1 text-xs font-medium bg-secondary text-muted-foreground rounded-full whitespace-nowrap flex-shrink-0">
                      {type.tag}
                    </span>
                  </div>
                  
                  <div className="mb-3 p-2 rounded bg-primary/10 border border-primary/20">
                    <p className="text-xs text-primary font-medium mb-1">Produced in:</p>
                    <p className="text-xs text-muted-foreground">
                      {type.producedIn.join(' • ')}
                    </p>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex items-center gap-1 mb-2">
                      <Check className="w-3.5 h-3.5 text-primary" />
                      <span className="text-xs font-semibold text-foreground">Common materials</span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
                      {type.commonMaterials.slice(0, 6).map((material, idx) => (
                        <p key={idx} className="text-xs text-muted-foreground">• {material}</p>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex items-center gap-1 mb-2">
                      <X className="w-3.5 h-3.5 text-destructive" />
                      <span className="text-xs font-semibold text-foreground">Materials to avoid</span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
                      {type.materialsToAvoid.slice(0, 6).map((material, idx) => (
                        <p key={idx} className="text-xs text-muted-foreground">• {material}</p>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2 text-xs text-muted-foreground bg-secondary/50 rounded p-2">
                    <Info className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                    <span>{type.tip}</span>
                  </div>
                </div>
                
                <div className="border-t border-border bg-secondary/30 px-4 py-3">
                  <div className="flex items-center gap-2 text-xs">
                    <Eye className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">
                      <span className="font-medium text-foreground">Visual assessment:</span> Each supplier checks waste on-site
                    </span>
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
