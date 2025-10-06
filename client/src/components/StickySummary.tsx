import { Button } from '@/components/ui/button';
import { useJourneyStore } from '@/store/journeyStore';
import { formatCurrency } from '@/lib/utils';

interface StickySummaryProps {
  onContinue?: () => void;
  continueDisabled?: boolean;
  continueText?: string;
}

export default function StickySummary({ onContinue, continueDisabled, continueText = "Continue" }: StickySummaryProps) {
  const { size, items, placement, totals, providerId } = useJourneyStore();
  
  return (
    <div className="sticky bottom-0 md:top-20 bg-card border border-card-border rounded-md p-6 shadow-soft" data-testid="sticky-summary">
      <h3 className="text-lg font-semibold mb-4">Your Selection</h3>
      
      <div className="space-y-2 mb-6">
        {size && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Skip Size</span>
            <span className="font-medium">{size}</span>
          </div>
        )}
        
        {placement && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Placement</span>
            <span className="font-medium capitalize">{placement}</span>
          </div>
        )}
        
        {items.length > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Extra Items</span>
            <span className="font-medium">{items.length}</span>
          </div>
        )}
        
        {totals.total > 0 && (
          <>
            <div className="border-t border-border my-3" />
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Total (inc VAT)</span>
              <span className="text-lg font-bold text-foreground">{formatCurrency(totals.total)}</span>
            </div>
          </>
        )}
        
        {providerId && (
          <div className="text-sm text-primary mt-2">
            Provider selected ✓
          </div>
        )}
      </div>
      
      {onContinue && (
        <Button
          onClick={onContinue}
          disabled={continueDisabled}
          className="w-full"
          data-testid="button-continue"
        >
          {continueText}
        </Button>
      )}
    </div>
  );
}
