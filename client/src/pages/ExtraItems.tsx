import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import Header from '@/components/Header';
import ProgressRibbon from '@/components/ProgressRibbon';
import EducationPill from '@/components/EducationPill';
import Chip from '@/components/Chip';
import { useJourneyStore } from '@/store/journeyStore';
import { motion } from 'framer-motion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const items = [
  'Mattress',
  'Tyres',
  'Fridge/Freezer',
  'Plasterboard',
  'Gas Bottles',
  'Batteries',
  'Carpet',
];

const hazardousItems = ['Asbestos', 'Paints/Liquids'];

export default function ExtraItems() {
  const [, setLocation] = useLocation();
  const { items: selectedItems, toggleItem, setItems } = useJourneyStore();
  const [showHazardWarning, setShowHazardWarning] = useState(false);
  
  const handleItemClick = (item: string) => {
    toggleItem(item);
  };
  
  const handleNoneClick = () => {
    setItems([]);
  };
  
  const handleContinue = () => {
    setLocation('/size');
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
          Any of these items?
        </h1>
        
        <ProgressRibbon currentStep={3} />
        
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="grid grid-cols-2 gap-3 mt-8">
            {items.map((item) => (
              <Chip
                key={item}
                selected={selectedItems.includes(item)}
                onClick={() => handleItemClick(item)}
              >
                {item}
              </Chip>
            ))}
          </div>
          
          <Chip
            selected={selectedItems.length === 0}
            onClick={handleNoneClick}
            className="w-full"
          >
            None of the above
          </Chip>
          
          <div className="bg-destructive/10 border border-destructive/20 rounded-md p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Hazardous items not accepted:</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {hazardousItems.join(', ')} - These require special disposal
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center pt-4">
            <Button size="lg" onClick={handleContinue} data-testid="button-continue">
              Continue
            </Button>
          </div>
          
          <EducationPill text="Some items need special handling — telling us now avoids surprise charges." />
        </div>
      </motion.main>
      
      <AlertDialog open={showHazardWarning} onOpenChange={setShowHazardWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hazardous Waste</AlertDialogTitle>
            <AlertDialogDescription>
              This item requires special disposal and cannot be placed in a standard skip. Please contact your local council for proper disposal options.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Understood</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
