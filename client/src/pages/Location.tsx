import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import Header from '@/components/Header';
import ProgressRibbon from '@/components/ProgressRibbon';
import EducationPill from '@/components/EducationPill';
import Chip from '@/components/Chip';
import { useJourneyStore } from '@/store/journeyStore';
import { motion } from 'framer-motion';
import { MapPin, Home, Truck } from 'lucide-react';

export default function Location() {
  const [, setLocation] = useLocation();
  const { postcode, address, lat, lng, placement, setLocation: setJourneyLocation, setPlacement } = useJourneyStore();
  const [position, setPosition] = useState<[number, number]>([lat, lng]);
  const [showPermitDialog, setShowPermitDialog] = useState(false);
  
  useEffect(() => {
    setPosition([lat, lng]);
  }, [lat, lng]);
  
  const handlePlacementSelect = (type: 'driveway' | 'road') => {
    if (type === 'road') {
      setShowPermitDialog(true);
    } else {
      setPlacement(type);
    }
  };
  
  const handlePermitGoBack = () => {
    setShowPermitDialog(false);
  };
  
  const handlePermitAgree = () => {
    setPlacement('road');
    setJourneyLocation(position[0], position[1], 'mock.what3.words');
    setShowPermitDialog(false);
    setLocation('/waste');
  };
  
  const handleContinue = () => {
    if (!placement) return;
    setJourneyLocation(position[0], position[1], 'mock.what3.words');
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
          Confirm the location
        </h1>
        
        <ProgressRibbon currentStep={0} />
        
        <div className="max-w-4xl mx-auto space-y-8">
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
          
          <div className="space-y-4 pt-4">
            <div className="text-center space-y-2">
              <p className="text-lg text-foreground" data-testid="text-placement-question">
                Just to check — do you own or have permission for the land where the skip will go?
              </p>
              <p className="text-sm text-muted-foreground" data-testid="text-placement-helper">
                (It helps us know if we need to arrange a permit.)
              </p>
            </div>
            
            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={() => handlePlacementSelect('driveway')}
                className={`
                  flex items-center gap-3 px-6 py-4 rounded-md border-2 transition-all
                  ${placement === 'driveway' 
                    ? 'border-primary bg-primary/5 text-foreground' 
                    : 'border-border bg-background text-foreground hover-elevate'
                  }
                `}
                data-testid="button-driveway"
              >
                <Home className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-medium">Yes, on my property</div>
                  <div className="text-sm text-muted-foreground">Driveway, garden, or private land</div>
                </div>
              </button>
              
              <button
                onClick={() => handlePlacementSelect('road')}
                className={`
                  flex items-center gap-3 px-6 py-4 rounded-md border-2 transition-all
                  ${placement === 'road' 
                    ? 'border-primary bg-primary/5 text-foreground' 
                    : 'border-border bg-background text-foreground hover-elevate'
                  }
                `}
                data-testid="button-road"
              >
                <Truck className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-medium">No, on the road</div>
                  <div className="text-sm text-muted-foreground">We'll arrange the permit for you</div>
                </div>
              </button>
            </div>
          </div>
          
          <div className="flex justify-center">
            <Button 
              size="lg" 
              onClick={handleContinue} 
              disabled={!placement}
              data-testid="button-continue"
            >
              Continue
            </Button>
          </div>
          
          <EducationPill text="Exact location prevents access issues and speeds up delivery." />
        </div>
      </motion.main>
      
      <AlertDialog open={showPermitDialog} onOpenChange={setShowPermitDialog}>
        <AlertDialogContent data-testid="dialog-permit">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold text-foreground">
              Council Permit Required
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base text-foreground space-y-3 pt-2">
              <p>
                On-road skips typically require a council permit. This can take up to 2 weeks and may have a local fee (usually £100-£200).
              </p>
              <p className="text-muted-foreground">
                No stress though, we'll handle the permit application. Do you want to proceed?
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3 sm:gap-3">
            <Button
              variant="outline"
              onClick={handlePermitGoBack}
              data-testid="button-go-back"
            >
              Go back
            </Button>
            <Button
              onClick={handlePermitAgree}
              data-testid="button-agree-continue"
            >
              Agree and continue
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
