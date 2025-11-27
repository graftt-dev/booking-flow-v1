import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import ProgressRibbon from '@/components/ProgressRibbon';
import EducationPill from '@/components/EducationPill';
import { useJourneyStore, type SkipSize as SkipSizeType } from '@/store/journeyStore';
import { motion } from 'framer-motion';
import { calculateTotals } from '@/lib/pricing';
import { ArrowLeft, Phone, Mail, Flame, Gauge, Ruler, Weight } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import skip2ydImage from '@assets/02 Yard_1764258203014.png';

const skipSizes = [
  { 
    id: '2yd', 
    label: '2', 
    unit: 'yard',
    cubicYards: 2,
    binBags: 20,
    tag: 'Mini',
    dimensions: '1.2m × 1.0m × 0.9m',
    weight: 'Up to ~1 tonne',
    perfectFor: [
      'Small garden tidy-up',
      'Wardrobe clear-out',
      'Light DIY waste'
    ]
  },
  { 
    id: '3yd', 
    label: '3', 
    unit: 'yard',
    cubicYards: 3,
    binBags: 30,
    tag: 'Mini',
    dimensions: '1.5m × 1.2m × 0.9m',
    weight: 'Up to ~1.5 tonnes',
    perfectFor: [
      'Single room clearance',
      'Small kitchen refit',
      'Moderate garden waste'
    ]
  },
  { 
    id: '4yd', 
    label: '4', 
    unit: 'yard',
    cubicYards: 4,
    binBags: 40,
    tag: 'Midi',
    dimensions: '1.8m × 1.2m × 1.0m',
    weight: 'Up to ~2 tonnes',
    perfectFor: [
      'Small bathroom renovation',
      'Garden shed clear-out',
      'Kitchen cabinet removal'
    ]
  },
  { 
    id: '6yd', 
    label: '6', 
    unit: 'yard',
    cubicYards: 6,
    binBags: 60,
    tag: "Builders' choice",
    dimensions: '3.0m × 1.5m × 1.0m',
    weight: 'Up to ~3 tonnes',
    perfectFor: [
      'Full bathroom refit',
      'Kitchen renovation waste',
      'Garage or loft clearance'
    ]
  },
  { 
    id: '8yd', 
    label: '8', 
    unit: 'yard',
    cubicYards: 8,
    binBags: 80,
    tag: "Builders' choice",
    dimensions: '3.7m × 1.7m × 1.2m',
    weight: 'Up to ~4 tonnes',
    perfectFor: [
      'Large house clearance',
      'Full garden landscaping',
      'Major renovation project'
    ]
  },
  { 
    id: '12yd', 
    label: '12', 
    unit: 'yard',
    cubicYards: 12,
    binBags: 120,
    tag: 'Maxi (light waste)',
    dimensions: '3.7m × 1.8m × 1.5m',
    weight: 'Up to ~6 tonnes',
    perfectFor: [
      'Complete home refurbishment',
      'Commercial fit-out waste',
      'Large construction projects'
    ]
  },
  { 
    id: '14yd', 
    label: '14', 
    unit: 'yard',
    cubicYards: 14,
    binBags: 140,
    tag: 'Maxi (light waste)',
    dimensions: '4.0m × 1.8m × 1.6m',
    weight: 'Up to ~7 tonnes',
    perfectFor: [
      'Major commercial projects',
      'Full house demolition waste',
      'Large-scale renovations'
    ]
  },
  { 
    id: '16yd', 
    label: '16', 
    unit: 'yard',
    cubicYards: 16,
    binBags: 160,
    tag: 'Maxi (light waste)',
    dimensions: '4.2m × 1.8m × 1.8m',
    weight: 'Up to ~8 tonnes',
    perfectFor: [
      'Heavy construction waste',
      'Complete building refits',
      'Industrial-scale projects'
    ]
  },
];

export default function SkipSize() {
  const [, setLocation] = useLocation();
  const { size, setSize, items, itemQuantities, placement, setTotals } = useJourneyStore();
  const [showContactDialog, setShowContactDialog] = useState(false);
  
  const handleSelect = (sizeId: SkipSizeType) => {
    setSize(sizeId);
    const totals = calculateTotals(sizeId, items, placement || 'driveway', itemQuantities);
    setTotals(totals);
  };
  
  const handleOtherClick = () => {
    setShowContactDialog(true);
  };
  
  const handleContinue = () => {
    if (!size) return;
    setLocation('/waste');
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
        
        <ProgressRibbon currentStep={1} />
        
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            {skipSizes.map((skip) => (
              <button
                key={skip.id}
                onClick={() => handleSelect(skip.id as SkipSizeType)}
                className={`
                  text-left rounded-md border-2 transition-all relative overflow-hidden
                  ${size === skip.id 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border bg-background hover-elevate'
                  }
                `}
                data-testid={`tile-${skip.id}`}
              >
                {skip.tag && (
                  <div className="absolute top-3 right-3 z-10">
                    <span className="px-3 py-1.5 text-xs font-medium bg-secondary text-muted-foreground rounded-full">
                      {skip.tag}
                    </span>
                  </div>
                )}
                
                <div className="flex">
                  <div className="flex-1 p-4">
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="text-4xl font-bold text-foreground">{skip.label}</span>
                      <span className="text-lg font-medium text-muted-foreground">{skip.unit}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Holds approx. <span className="font-semibold text-foreground">{skip.binBags} bin bags</span>
                    </p>
                    <p className="text-xs text-muted-foreground mb-3">
                      {skip.cubicYards} cubic yards
                    </p>
                    
                    <p className="text-sm font-semibold text-foreground mb-2">Perfect for:</p>
                    <ul className="space-y-1">
                      {skip.perfectFor.map((item, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start">
                          <span className="mr-2 text-primary">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="w-36 flex-shrink-0 flex items-center justify-center p-2 pt-8">
                    <img 
                      src={skip2ydImage} 
                      alt={`${skip.label} yard skip`}
                      className="w-full h-auto object-contain"
                    />
                  </div>
                </div>
                
                <div className="flex gap-8 px-4 py-3 border-t border-border/50">
                  <div className="flex items-start gap-2">
                    <Ruler className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Dimensions</p>
                      <p className="text-sm font-medium text-foreground">{skip.dimensions}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Weight className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Weight</p>
                      <p className="text-sm font-medium text-foreground">{skip.weight}</p>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-border bg-secondary/30 px-4 py-3 space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <Gauge className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">
                      <span className="font-medium text-foreground">Level fill:</span> fill to 95% - leave 5-10cm from the top
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Flame className="w-3.5 h-3.5 text-destructive flex-shrink-0" />
                    <span className="text-muted-foreground">
                      <span className="font-medium text-foreground">No fires:</span> leave out any substances that ignite
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          <button
            onClick={handleOtherClick}
            className="w-full mt-4 px-4 py-4 rounded-md border border-[#05E4C0]/30 bg-[#05E4C0]/10 hover:bg-[#05E4C0]/20 transition-all text-left"
            data-testid="tile-other"
          >
            <p className="text-lg font-semibold text-[#06062D] dark:text-[#05E4C0]">Don't see the size you need?</p>
            <p className="text-sm text-[#06062D]/70 dark:text-[#05E4C0]/70 mt-1">Get in touch with us for a bespoke solution</p>
          </button>

          <AlertDialog open={showContactDialog} onOpenChange={setShowContactDialog}>
            <AlertDialogContent data-testid="dialog-contact">
              <AlertDialogHeader>
                <AlertDialogTitle>Get in touch with GRAFTT</AlertDialogTitle>
                <AlertDialogDescription className="space-y-4">
                  <p>
                    Need a custom skip size or have specific requirements? Our team is here to help you find the perfect solution.
                  </p>
                  
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-3 text-foreground">
                      <Phone className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-semibold">Call us</p>
                        <a href="tel:0800123456" className="text-primary hover:underline">
                          0800 123 456
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 text-foreground">
                      <Mail className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-semibold">Email us</p>
                        <a href="mailto:hello@graftt.co.uk" className="text-primary hover:underline">
                          hello@graftt.co.uk
                        </a>
                      </div>
                    </div>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction data-testid="button-close-dialog">Got it</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <div className="flex justify-center items-center gap-4 mt-8">
            <Button
              variant="ghost"
              onClick={() => setLocation('/location')}
              data-testid="button-back"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
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
