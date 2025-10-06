import StickySummary from '../StickySummary';
import { useJourneyStore } from '@/store/journeyStore';
import { useEffect } from 'react';

export default function StickySummaryExample() {
  const { setSize, setPlacement, setItems, setTotals } = useJourneyStore();
  
  useEffect(() => {
    setSize('6yd');
    setPlacement('driveway');
    setItems(['Mattress', 'Carpet']);
    setTotals({ base: 220, extras: 25, permit: 0, vat: 49, total: 294 });
  }, [setSize, setPlacement, setItems, setTotals]);
  
  return (
    <div className="p-8 max-w-md">
      <StickySummary
        onContinue={() => console.log('Continue clicked')}
        continueText="Continue to Checkout"
      />
    </div>
  );
}
