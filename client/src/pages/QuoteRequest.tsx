import { useState } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import Header from '@/components/Header';
import ProgressRibbon from '@/components/ProgressRibbon';
import { useJourneyStore } from '@/store/journeyStore';
import { providers } from '@/lib/providers';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';

const wasteTypeLabels: Record<string, string> = {
  'house': 'house clearance',
  'renovation': 'renovation',
  'garden': 'garden makeover',
  'soil': 'soil & rubble',
  'diy': 'DIY woodwork',
};

const skipSizeNames: Record<string, { name: string; yards: string }> = {
  '2yd': { name: 'Mini Skip', yards: '2 cubic yards' },
  '4yd': { name: 'Midi Skip', yards: '4 cubic yards' },
  '6yd': { name: 'Builders Skip', yards: '6 cubic yards' },
  '8yd': { name: 'Large Skip', yards: '8 cubic yards' },
  '12yd': { name: 'Maxi Skip', yards: '12 cubic yards' },
  '14yd': { name: 'Large Maxi', yards: '14 cubic yards' },
  '16yd': { name: 'Roll-on Roll-off', yards: '16 cubic yards' },
};


const quoteFormSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number').max(15, 'Phone number is too long'),
  message: z.string().optional(),
  selectedItems: z.array(z.string()).optional(),
});

type QuoteFormValues = z.infer<typeof quoteFormSchema>;


export default function QuoteRequest() {
  const [, setLocationPath] = useLocation();
  const { postcode, address, w3w, placement, wasteType, size, providerId, deliveryDate, collectionDate, items: journeyItems, itemQuantities, flags } = useJourneyStore();
  
  const [submitted, setSubmitted] = useState(false);
  
  const provider = providers.find(p => p.id === providerId);
  const skipInfo = skipSizeNames[size || '6yd'] || { name: 'Skip', yards: '' };

  const formatDeliveryDate = () => {
    if (!deliveryDate) return 'ASAP';
    try {
      const date = new Date(deliveryDate);
      return format(date, 'EEEE d MMMM');
    } catch {
      return deliveryDate;
    }
  };

  const formatCollectionDate = () => {
    if (!collectionDate) return { text: 'ASAP', isFlexible: false };
    try {
      if (collectionDate.includes('|')) {
        const [start, end] = collectionDate.split('|');
        const startDate = new Date(start);
        const endDate = new Date(end);
        return { 
          text: `${format(startDate, 'EEEE d MMMM')} and ${format(endDate, 'EEEE d MMMM')}`,
          isFlexible: true 
        };
      }
      const date = new Date(collectionDate);
      return { text: format(date, 'EEEE d MMMM'), isFlexible: false };
    } catch {
      return { text: collectionDate, isFlexible: false };
    }
  };

  const getWasteTypeLabel = () => {
    return wasteTypeLabels[wasteType] || wasteType;
  };

  const getItemsText = () => {
    if (journeyItems.length === 0) return '';
    
    const itemsWithQty = journeyItems.map(item => {
      const qty = itemQuantities[item] || 1;
      return qty > 1 ? `${qty}× ${item}` : item;
    });
    
    if (itemsWithQty.length === 1) return itemsWithQty[0];
    if (itemsWithQty.length === 2) return `${itemsWithQty[0]} and ${itemsWithQty[1]}`;
    
    const lastItem = itemsWithQty[itemsWithQty.length - 1];
    const otherItems = itemsWithQty.slice(0, -1).join(', ');
    return `${otherItems}, and ${lastItem}`;
  };
  
  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      email: '',
      phone: '',
      message: '',
    },
  });
  
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
  
  const onSubmit = async (data: QuoteFormValues) => {
    if (!providerId) {
      setLocationPath('/providers');
      return;
    }
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSubmitted(true);
  };
  
  if (!providerId) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <motion.main 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="container mx-auto px-4 py-8 text-center"
        >
          <h1 className="text-2xl font-bold text-foreground mb-4" data-testid="text-no-provider">
            No Provider Selected
          </h1>
          <p className="text-muted-foreground mb-6">Please go back and select a provider to request a quote.</p>
          <Button onClick={() => setLocationPath('/providers')} data-testid="button-go-providers">
            Go to Providers
          </Button>
        </motion.main>
      </div>
    );
  }
  
  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <motion.main 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 py-8"
        >
          <div className="max-w-xl mx-auto text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
              className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </motion.div>
            
            <h1 className="text-3xl font-bold text-foreground mb-4" data-testid="text-success-title">
              Quote Request Sent
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8" data-testid="text-success-message">
              We've sent your quote request to <span className="font-semibold text-foreground">{provider?.name}</span>. 
              They'll get back to you within 24 hours.
            </p>
            
            <Card className="p-6 mb-8 text-left">
              <h3 className="font-semibold text-foreground mb-4" data-testid="text-next-steps">What happens next?</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-3" data-testid="step-1">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                  <span>The provider will review your requirements</span>
                </li>
                <li className="flex items-start gap-3" data-testid="step-2">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                  <span>You'll receive a personalized quote via email</span>
                </li>
                <li className="flex items-start gap-3" data-testid="step-3">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                  <span>Accept the quote to confirm your booking</span>
                </li>
              </ul>
            </Card>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={() => setLocationPath('/providers')}
                data-testid="button-back-providers"
              >
                Browse Other Providers
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setLocationPath('/')}
                data-testid="button-home"
              >
                Back to Home
              </Button>
            </div>
          </div>
        </motion.main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="container mx-auto px-4 py-8"
      >
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground text-center mb-2" data-testid="text-page-title">
            Request a Quote
          </h1>
          
          <p className="text-center text-muted-foreground mb-6" data-testid="text-provider-name">
            Get a personalized quote from <span className="font-semibold text-foreground">{provider?.name || 'this provider'}</span>
          </p>
          
          <ProgressRibbon currentStep={6} isQuoteFlow={true} />
          
          <div className="space-y-6 mt-8">
            <div className="bg-white dark:bg-card border border-card-border rounded-lg p-6 shadow-sm" data-testid="card-summary">
              <h2 className="text-xl font-semibold mb-4">Just to summarise…</h2>
              
              <div className="space-y-3 text-base leading-relaxed text-foreground/90">
                <p>
                  You've asked us to deliver your skip to{' '}
                  <span 
                    className="inline-flex items-center bg-[#05E4C0]/10 text-[#05E4C0] border border-[#05E4C0]/20 font-semibold px-2 py-0.5 rounded-full"
                    data-testid="badge-address"
                  >
                    {address || 'your location'}{postcode ? `, ${postcode}` : ''}
                  </span>
                  .
                </p>
                
                <p>
                  Your skip will be dropped in{' '}
                  <span 
                    className="inline-flex items-center bg-[#05E4C0]/10 text-[#05E4C0] border border-[#05E4C0]/20 font-semibold px-2 py-0.5 rounded-full"
                    data-testid="badge-w3w"
                  >
                    {w3w || '///mock.what3.words'}
                  </span>
                  {' '}location
                  {placement && (
                    <>
                      , and you've confirmed that you{' '}
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
                  You need it delivered{' '}
                  <span 
                    className="inline-flex items-center bg-[#05E4C0]/10 text-[#05E4C0] border border-[#05E4C0]/20 font-semibold px-2 py-0.5 rounded-full"
                    data-testid="badge-delivery-date"
                  >
                    {formatDeliveryDate()}
                  </span>
                  {' '}and collected {formatCollectionDate().isFlexible ? 'between' : 'on'}{' '}
                  <span 
                    className="inline-flex items-center bg-[#05E4C0]/10 text-[#05E4C0] border border-[#05E4C0]/20 font-semibold px-2 py-0.5 rounded-full"
                    data-testid="badge-collection-date"
                  >
                    {formatCollectionDate().text}
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

                <p>
                  {journeyItems.length > 0 ? (
                    <>
                      You've mentioned you'll be disposing of{' '}
                      <span 
                        className="inline-flex items-center bg-[#05E4C0]/10 text-[#05E4C0] border border-[#05E4C0]/20 font-semibold px-2 py-0.5 rounded-full"
                        data-testid="badge-items"
                      >
                        {getItemsText()}
                      </span>
                      , which we'll include in your quote request.
                    </>
                  ) : (
                    <>
                      You've confirmed{' '}
                      <span 
                        className="inline-flex items-center bg-[#05E4C0]/10 text-[#05E4C0] border border-[#05E4C0]/20 font-semibold px-2 py-0.5 rounded-full"
                        data-testid="badge-no-items"
                      >
                        no additional items
                      </span>
                      {' '}will be included.
                    </>
                  )}
                </p>

                <p>
                  You've chosen a{' '}
                  <span 
                    className="inline-flex items-center bg-[#05E4C0]/10 text-[#05E4C0] border border-[#05E4C0]/20 font-semibold px-2 py-0.5 rounded-full"
                    data-testid="badge-size"
                  >
                    {size} ({skipInfo.name})
                  </span>
                  {' '}skip and you're requesting a quote from{' '}
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

                <p className="pt-2 text-foreground font-medium">
                  Does everything look right? Fill in your details below to request your personalised quote.
                </p>
              </div>
            </div>
            
            <Card className="p-5" data-testid="card-contact">
              <h2 className="text-lg font-semibold text-foreground mb-4">Contact Details</h2>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="you@example.com"
                              data-testid="input-email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage data-testid="error-email" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="07XXX XXX XXX"
                              data-testid="input-phone"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage data-testid="error-phone" />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Information (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Any special requirements or questions..."
                            rows={3}
                            data-testid="input-message"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage data-testid="error-message" />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setLocationPath('/items')}
                      data-testid="button-back"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    
                    <Button
                      type="submit"
                      size="lg"
                      disabled={form.formState.isSubmitting}
                      data-testid="button-submit"
                    >
                      {form.formState.isSubmitting ? (
                        <>Sending...</>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Request Quote
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </Card>
          </div>
        </div>
      </motion.main>
    </div>
  );
}
