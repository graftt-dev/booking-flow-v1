import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Shield, FileText, MapPin, Link as LinkIcon, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import ProgressRibbon from '@/components/ProgressRibbon';
import { useJourneyStore } from '@/store/journeyStore';
import { providers as allProviders } from '@/lib/providers';
import { formatCurrency } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { size, items, placement, totals, providerId, customer, setCustomer } = useJourneyStore();
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  
  const provider = allProviders.find(p => p.id === providerId);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLocation('/confirmation');
    }, 1500);
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
          Complete your booking
        </h1>
        
        <ProgressRibbon currentStep={6} />
        
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 mt-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-card border border-card-border rounded-md p-6 space-y-4">
              <h2 className="text-lg font-semibold">Your Details</h2>
              
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={customer.name}
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                  required
                  data-testid="input-name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={customer.email}
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                  required
                  data-testid="input-email"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  required
                  data-testid="input-phone"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Driver Notes (optional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Special instructions for delivery..."
                  data-testid="textarea-notes"
                />
              </div>
            </div>
            
            <div className="bg-secondary/30 border border-border rounded-md p-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>Licensed operator</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>Waste transfer note</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>GPS drop</span>
                </div>
                <div className="flex items-center gap-2">
                  <LinkIcon className="w-4 h-4" />
                  <span>Chain of custody</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setLocation('/providers')}
                data-testid="button-back"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                type="submit"
                size="lg"
                className="flex-1"
                disabled={loading}
                data-testid="button-pay"
              >
                {loading ? 'Processing...' : `Pay ${formatCurrency(totals.total)}`}
              </Button>
            </div>
          </form>
          
          <div className="space-y-6">
            <div className="bg-card border border-card-border rounded-md p-6 space-y-4">
              <h2 className="text-lg font-semibold">Order Summary</h2>
              
              {provider && (
                <div className="pb-3 border-b">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">{provider.logo}</span>
                    </div>
                    <div>
                      <p className="font-medium">{provider.name}</p>
                      <p className="text-sm text-muted-foreground">Earliest: {provider.earliestDay}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Skip Size</span>
                  <span className="font-medium">{size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Placement</span>
                  <span className="font-medium capitalize">{placement}</span>
                </div>
                {items.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Extra Items</span>
                    <span className="font-medium">{items.join(', ')}</span>
                  </div>
                )}
              </div>
              
              <div className="border-t pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Base price</span>
                  <span>{formatCurrency(totals.base)}</span>
                </div>
                {totals.extras > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Extra items</span>
                    <span>{formatCurrency(totals.extras)}</span>
                  </div>
                )}
                {totals.permit > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Permit fee</span>
                    <span>{formatCurrency(totals.permit)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">VAT (20%)</span>
                  <span>{formatCurrency(totals.vat)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">{formatCurrency(totals.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.main>
    </div>
  );
}
