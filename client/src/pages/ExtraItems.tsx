import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { AlertCircle, Minus, Plus, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import ProgressRibbon from '@/components/ProgressRibbon';
import EducationPill from '@/components/EducationPill';
import Chip from '@/components/Chip';
import { useJourneyStore } from '@/store/journeyStore';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ExtraItem {
  name: string;
  price: number;
  pricingType: 'per item' | 'per tonne';
}

const items: ExtraItem[] = [
  { name: 'Plasterboard / Gypsum Waste', price: 60, pricingType: 'per tonne' },
  { name: 'Gas Bottles', price: 50, pricingType: 'per item' },
  { name: 'Single Mattress', price: 20, pricingType: 'per item' },
  { name: 'Double Mattress', price: 30, pricingType: 'per item' },
  { name: 'Tyres', price: 5, pricingType: 'per item' },
  { name: 'Fridge/Freezer', price: 25, pricingType: 'per item' },
  { name: 'Sofa', price: 15, pricingType: 'per item' },
  { name: 'Batteries', price: 10, pricingType: 'per item' },
];

const notAcceptedItems = [
  'Asbestos',
  'Paint/Liquids',
  'Food waste',
  'Medical waste',
  'Chemicals & solvents',
  'Oil & fuel containers',
  'Fluorescent tubes'
];

export default function ExtraItems() {
  const [, setLocation] = useLocation();
  const { items: selectedItems, itemQuantities, toggleItem, setItems, setItemQuantity } = useJourneyStore();
  const [showHazardWarning, setShowHazardWarning] = useState(false);
  const [noneExplicitlySelected, setNoneExplicitlySelected] = useState(false);
  
  const handleItemClick = (item: string) => {
    toggleItem(item);
    setNoneExplicitlySelected(false);
  };
  
  const handleQuantityChange = (item: string, delta: number) => {
    const currentQty = itemQuantities[item] || 1;
    const newQty = Math.max(1, currentQty + delta);
    setItemQuantity(item, newQty);
  };
  
  const handleNoneClick = () => {
    setItems([]);
    setNoneExplicitlySelected(true);
  };
  
  const handleContinue = () => {
    setLocation('/checkout');
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
        
        <ProgressRibbon currentStep={5} />
        
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="grid grid-cols-1 gap-3 mt-8">
            {items.map((item) => {
              const isSelected = selectedItems.includes(item.name);
              const quantity = itemQuantities[item.name] || 1;
              
              return (
                <div key={item.name} className="flex items-center gap-3">
                  <div className="flex-1">
                    <Chip
                      selected={isSelected}
                      onClick={() => handleItemClick(item.name)}
                      className="w-full justify-start"
                    >
                      <span className="flex items-center gap-2">
                        <span>{item.name}</span>
                        <span className={cn(
                          "text-sm",
                          isSelected ? "text-primary-foreground/70" : "text-muted-foreground"
                        )}>
                          +£{item.price.toFixed(2)} {item.pricingType}
                        </span>
                      </span>
                    </Chip>
                  </div>
                  
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        className="flex items-center gap-2"
                      >
                        <button
                          onClick={() => handleQuantityChange(item.name, -1)}
                          className="w-8 h-8 rounded-md border border-border bg-background flex items-center justify-center hover-elevate active-elevate-2"
                          disabled={quantity <= 1}
                          data-testid={`button-decrease-${item.name}`}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-medium text-foreground min-w-8 text-center" data-testid={`text-quantity-${item.name}`}>
                          {quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.name, 1)}
                          className="w-8 h-8 rounded-md border border-border bg-background flex items-center justify-center hover-elevate active-elevate-2"
                          data-testid={`button-increase-${item.name}`}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
          
          <Chip
            selected={noneExplicitlySelected && selectedItems.length === 0}
            onClick={handleNoneClick}
            className={cn(
              "w-full bg-[#05E4C0]/10 border-[#05E4C0]/30 text-[#06062D] dark:text-[#05E4C0]",
              !noneExplicitlySelected && "hover:bg-[#05E4C0]/20",
              noneExplicitlySelected && selectedItems.length === 0 && "!bg-primary !text-primary-foreground !border-primary-border"
            )}
          >
            None of the above
          </Chip>
          
          <div className="bg-destructive/10 border border-destructive/20 rounded-md p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">This provider does not accept:</p>
                <ul className="text-sm text-muted-foreground mt-2 space-y-1 list-disc list-inside">
                  {notAcceptedItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center items-center gap-4 pt-4">
            <Button
              variant="ghost"
              onClick={() => setLocation('/providers')}
              data-testid="button-back"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
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
