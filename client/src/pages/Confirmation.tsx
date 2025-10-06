import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { CheckCircle, Download, Calendar, RotateCw } from 'lucide-react';
import Header from '@/components/Header';
import { useJourneyStore } from '@/store/journeyStore';
import { providers as allProviders } from '@/lib/providers';
import { formatCurrency } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function Confirmation() {
  const [, setLocation] = useLocation();
  const { providerId, totals, reset } = useJourneyStore();
  const [orderRef, setOrderRef] = useState('');
  
  const provider = allProviders.find(p => p.id === providerId);
  
  useEffect(() => {
    setOrderRef(`GFT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`);
  }, []);
  
  const handleBookAnother = () => {
    reset();
    setLocation('/');
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <motion.main 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-16"
      >
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
              <CheckCircle className="w-12 h-12 text-primary" />
            </div>
          </motion.div>
          
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-3" data-testid="text-confirmation-title">
              Booking Confirmed!
            </h1>
            <p className="text-lg text-muted-foreground">
              Your skip has been booked successfully
            </p>
          </div>
          
          <div className="bg-card border border-card-border rounded-md p-8 text-left space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Order Reference</p>
                <p className="text-2xl font-bold text-foreground" data-testid="text-order-ref">{orderRef}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground mb-1">Total Paid</p>
                <p className="text-2xl font-bold text-primary">{formatCurrency(totals.total)}</p>
              </div>
            </div>
            
            {provider && (
              <div className="border-t pt-6">
                <p className="text-sm text-muted-foreground mb-3">Provider</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">{provider.logo}</span>
                  </div>
                  <div>
                    <p className="font-semibold">{provider.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Delivery: {provider.earliestDay} ({provider.earliestRange})
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="gap-2" data-testid="button-download">
              <Download className="w-4 h-4" />
              Download Transfer Note
            </Button>
            <Button variant="outline" className="gap-2" data-testid="button-calendar">
              <Calendar className="w-4 h-4" />
              Add to Calendar
            </Button>
            <Button onClick={handleBookAnother} className="gap-2" data-testid="button-book-another">
              <RotateCw className="w-4 h-4" />
              Book Another
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground">
            A confirmation email has been sent with all the details and your waste transfer note.
          </p>
        </div>
      </motion.main>
    </div>
  );
}
