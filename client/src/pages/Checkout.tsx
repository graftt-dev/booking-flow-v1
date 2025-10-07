import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Shield, FileText, MapPin, Link as LinkIcon, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import ProgressRibbon from '@/components/ProgressRibbon';
import EducationPill from '@/components/EducationPill';
import { useJourneyStore } from '@/store/journeyStore';
import { providers as allProviders } from '@/lib/providers';
import { formatCurrency } from '@/lib/utils';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

const wasteTypeLabels: Record<string, string> = {
  'house': 'house clearance',
  'renovation': 'renovation',
  'garden': 'garden makeover',
  'soil': 'soil & rubble',
  'diy': 'DIY woodwork',
};

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { 
    size, 
    items, 
    itemQuantities,
    placement, 
    totals, 
    providerId, 
    customer, 
    setCustomer, 
    address,
    wasteType,
    deliveryDate,
    flags
  } = useJourneyStore();
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

  const formatDeliveryDate = () => {
    if (!deliveryDate) return 'ASAP';
    try {
      const date = new Date(deliveryDate);
      return format(date, 'EEEE d MMMM');
    } catch {
      return deliveryDate;
    }
  };

  const getWasteTypeLabel = () => {
    return wasteTypeLabels[wasteType] || wasteType;
  };

  const getItemsText = () => {
    if (items.length === 0) return '';
    
    const itemsWithQty = items.map(item => {
      const qty = itemQuantities[item] || 1;
      return qty > 1 ? `${qty}× ${item}` : item;
    });
    
    if (itemsWithQty.length === 1) return itemsWithQty[0];
    if (itemsWithQty.length === 2) return `${itemsWithQty[0]} and ${itemsWithQty[1]}`;
    
    const lastItem = itemsWithQty[itemsWithQty.length - 1];
    const otherItems = itemsWithQty.slice(0, -1).join(', ');
    return `${otherItems}, and ${lastItem}`;
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

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="max-w-4xl mx-auto mt-8"
        >
          <div className="bg-white dark:bg-card border border-card-border rounded-lg p-6 shadow-sm" data-testid="section-summary">
            <h2 className="text-xl font-semibold mb-4">Just to summarise…</h2>
            
            <div className="space-y-3 text-base leading-relaxed text-foreground/90">
              <p>
                You've asked us to deliver your skip to{' '}
                <span 
                  className="inline-flex items-center bg-[#05E4C0]/10 text-[#05E4C0] border border-[#05E4C0]/20 font-semibold px-2 py-0.5 rounded-full"
                  data-testid="badge-address"
                >
                  {address || 'your location'}
                </span>
                {placement && (
                  <>
                    , and confirmed that you{' '}
                    {flags.onRoadFromHome === false ? (
                      <>
                        own the land so{' '}
                        <span className="inline-flex items-center bg-[#05E4C0]/10 text-[#05E4C0] border border-[#05E4C0]/20 font-semibold px-2 py-0.5 rounded-full">
                          no permit's needed
                        </span>
                      </>
                    ) : (
                      <>
                        need a{' '}
                        <span className="inline-flex items-center bg-[#05E4C0]/10 text-[#05E4C0] border border-[#05E4C0]/20 font-semibold px-2 py-0.5 rounded-full">
                          road permit
                        </span>
                      </>
                    )}
                  </>
                )}
                .
              </p>

              <p>
                You need it{' '}
                <span 
                  className="inline-flex items-center bg-[#05E4C0]/10 text-[#05E4C0] border border-[#05E4C0]/20 font-semibold px-2 py-0.5 rounded-full"
                  data-testid="badge-delivery-date"
                >
                  {formatDeliveryDate()}
                </span>
                {wasteType && (
                  <>
                    {' '}for your{' '}
                    <span 
                      className="inline-flex items-center bg-[#05E4C0]/10 text-[#05E4C0] border border-[#05E4C0]/20 font-semibold px-2 py-0.5 rounded-full"
                      data-testid="badge-waste-type"
                    >
                      {getWasteTypeLabel()}
                    </span>
                    {' '}project
                  </>
                )}
                .
              </p>

              {items.length > 0 && (
                <p>
                  You've mentioned you'll be disposing of{' '}
                  <span 
                    className="inline-flex items-center bg-[#05E4C0]/10 text-[#05E4C0] border border-[#05E4C0]/20 font-semibold px-2 py-0.5 rounded-full"
                    data-testid="badge-items"
                  >
                    {getItemsText()}
                  </span>
                  , which we've included in the quote.
                </p>
              )}

              <p>
                You've chosen a{' '}
                <span 
                  className="inline-flex items-center bg-[#05E4C0]/10 text-[#05E4C0] border border-[#05E4C0]/20 font-semibold px-2 py-0.5 rounded-full"
                  data-testid="badge-size"
                >
                  {size}
                </span>
                {' '}skip from{' '}
                {provider && (
                  <span 
                    className="inline-flex items-center bg-[#05E4C0]/10 text-[#05E4C0] border border-[#05E4C0]/20 font-semibold px-2 py-0.5 rounded-full"
                    data-testid="badge-provider"
                  >
                    {provider.name}
                  </span>
                )}
                .
              </p>

              <p className="pt-4 border-t mt-4">
                Your total comes to{' '}
                <span 
                  className="inline-flex items-center bg-[#05E4C0]/10 text-[#05E4C0] border border-[#05E4C0]/20 font-semibold px-2 py-0.5 rounded-full text-lg"
                  data-testid="badge-total"
                >
                  {formatCurrency(totals.total)}
                </span>
                {' '}(including VAT).
              </p>

              <p className="pt-2 text-foreground font-medium">
                Sound good? Then let's get this skip booked in.
              </p>
            </div>
          </div>

          <EducationPill text="Double-checking your answers helps us get everything right first time." />
        </motion.div>
        
        <div className="max-w-2xl mx-auto mt-8">
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
            
            <div className="bg-card border border-card-border rounded-md p-4">
              <p className="text-sm text-muted-foreground mb-3 text-center">Pay with</p>
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 border border-border rounded-md hover-elevate bg-background"
                  data-testid="button-google-pay"
                >
                  <svg className="w-12 h-5" viewBox="0 0 48 20" fill="none">
                    <path d="M23.7 10.2v3.8h-1.5V1h4c1 0 1.9.4 2.6 1 .7.7 1 1.6 1 2.6 0 1-.3 1.9-1 2.6-.7.7-1.6 1-2.6 1h-2.5zm0-7.7v6.2h2.5c.7 0 1.3-.2 1.8-.7.5-.5.7-1.1.7-1.8s-.2-1.3-.7-1.8c-.5-.5-1.1-.7-1.8-.7h-2.5zm11.5 3.7c1.1 0 2 .4 2.7 1.1.7.7 1 1.6 1 2.7v4h-1.4v-.9h-.1c-.6.8-1.3 1.1-2.3 1.1-.9 0-1.6-.3-2.2-.8-.6-.5-.9-1.2-.9-2 0-.8.3-1.5.9-2 .6-.5 1.4-.7 2.4-.7.8 0 1.5.1 2 .4v-.3c0-.6-.2-1.1-.6-1.5-.4-.4-.9-.6-1.5-.6-.8 0-1.4.3-1.9 1l-1.3-.8c.8-1 1.9-1.5 3.2-1.5zm-1.7 6.3c0 .4.2.7.5 1 .3.3.7.4 1.2.4.7 0 1.3-.3 1.8-.8.5-.5.8-1.1.8-1.8-.5-.3-1.1-.5-1.9-.5-.6 0-1.1.2-1.5.5-.4.3-.6.7-.6 1.2zm10.5-9.5l-6 14h-1.5l2.2-4.8-3.9-9.2h1.6l3 7.4h.1l2.9-7.4h1.6z" fill="currentColor"/>
                    <path d="M19.1 8.2c0-.5 0-.9-.1-1.4H10v2.6h5.1c-.2 1.1-.8 2-1.8 2.6v2.1h2.9c1.7-1.6 2.7-3.9 2.7-6.6 0-.6 0-1.2-.1-1.7z" fill="#4285F4"/>
                    <path d="M10 16.5c2.4 0 4.5-.8 6-2.1l-2.9-2.3c-.8.5-1.8.9-3.1.9-2.4 0-4.4-1.6-5.1-3.8H2v2.4c1.5 3 4.6 5 8 5z" fill="#34A853"/>
                    <path d="M4.9 9.2c-.4-1.1-.4-2.3 0-3.4V3.4H2c-1.3 2.5-1.3 5.5 0 8l2.9-2.2z" fill="#FBBC04"/>
                    <path d="M10 3.9c1.3 0 2.5.5 3.4 1.3l2.5-2.5C14.5 1.3 12.4.5 10 .5c-3.4 0-6.5 2-8 5l2.9 2.3c.7-2.2 2.7-3.8 5.1-3.8z" fill="#EA4335"/>
                  </svg>
                </button>
                
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 border border-border rounded-md hover-elevate bg-background"
                  data-testid="button-apple-pay"
                >
                  <svg className="w-12 h-5" viewBox="0 0 48 20" fill="currentColor">
                    <path d="M8.4 3.8c.5-.6.8-1.5.7-2.3-.7 0-1.6.5-2.1 1-.5.5-.9 1.4-.8 2.2.8.1 1.6-.4 2.2-1zm.7 1.2c-1.2-.1-2.2.7-2.8.7-.6 0-1.5-.6-2.5-.6-1.3 0-2.5.8-3.1 1.9-1.3 2.3-.4 5.7 1 7.6.7 1 1.5 2 2.6 2 .9 0 1.3-.6 2.4-.6 1.1 0 1.4.6 2.4.6 1 0 1.8-1 2.5-1.9.8-1.1 1.1-2.2 1.1-2.2s-2.2-.8-2.2-3.2c0-2 1.6-3 1.7-3.1-1-1.4-2.4-1.6-3-1.6zm11.4-.7v9.8h1.5v-3.4h2.1c1.9 0 3.2-1.3 3.2-3.2s-1.3-3.2-3.1-3.2h-3.7zm1.5 1.2h1.8c1.3 0 2 .7 2 2s-.7 2-2 2h-1.8V5.5zm10.5 4.8c0 1.5 1.2 2.5 2.9 2.5 1.4 0 2.4-.7 2.7-1.7h-1.4c-.2.5-.7.8-1.3.8-.9 0-1.5-.6-1.5-1.6s.6-1.6 1.5-1.6c.6 0 1.1.3 1.3.8h1.4c-.3-1-1.3-1.7-2.7-1.7-1.7 0-2.9 1-2.9 2.5zm10.6-2.3c-.7 0-1.3.4-1.5 1h0v-.9h-1.4v4.8h1.4v-2.7c0-.8.4-1.3 1.2-1.3.7 0 1.1.4 1.1 1.1v3h1.4v-3.2c0-1.3-.8-2.1-2.1-2.1zm4.3 4.9c.4.7 1.2 1.1 2.1 1.1 1.3 0 2.1-.7 2.1-1.8v-4h-1.4v.9h0c-.3-.6-.9-1-1.7-1-1.3 0-2.2.9-2.2 2.4s.9 2.4 2.2 2.4c.8 0 1.4-.4 1.7-1h0v.9c0 .7-.5 1.1-1.2 1.1-.5 0-.9-.2-1.1-.6l-1.3.5zm3.6-2.4c0 .9-.5 1.5-1.3 1.5s-1.3-.6-1.3-1.5.5-1.5 1.3-1.5 1.3.6 1.3 1.5z"/>
                  </svg>
                </button>
                
                <span className="text-muted-foreground">or card</span>
              </div>
            </div>
          </form>
        </div>
      </motion.main>
    </div>
  );
}
