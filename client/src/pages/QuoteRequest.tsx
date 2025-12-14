import { useState } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
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
import { ArrowLeft, MapPin, Package, Trash2, Calendar, CalendarCheck, AlertTriangle, Send, CheckCircle2 } from 'lucide-react';
import { format, parse } from 'date-fns';
import { cn } from '@/lib/utils';

const skipSizeNames: Record<string, { name: string; yards: string }> = {
  '2yd': { name: 'Mini Skip', yards: '2 cubic yards' },
  '4yd': { name: 'Midi Skip', yards: '4 cubic yards' },
  '6yd': { name: 'Builders Skip', yards: '6 cubic yards' },
  '8yd': { name: 'Large Skip', yards: '8 cubic yards' },
  '12yd': { name: 'Maxi Skip', yards: '12 cubic yards' },
  '14yd': { name: 'Large Maxi', yards: '14 cubic yards' },
  '16yd': { name: 'Roll-on Roll-off', yards: '16 cubic yards' },
};

const allItems = [
  { id: 'mattress', name: 'Mattress', appropriate: true },
  { id: 'fridge', name: 'Fridge/Freezer', appropriate: false },
  { id: 'sofa', name: 'Sofa', appropriate: true },
  { id: 'washing-machine', name: 'Washing Machine', appropriate: false },
  { id: 'tv', name: 'TV/Monitor', appropriate: false },
  { id: 'paint', name: 'Paint Cans', appropriate: true },
  { id: 'tyres', name: 'Tyres', appropriate: false },
  { id: 'batteries', name: 'Batteries', appropriate: false },
  { id: 'plasterboard', name: 'Plasterboard', appropriate: true },
  { id: 'rubble', name: 'Rubble/Bricks', appropriate: true },
];

const quoteFormSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number').max(15, 'Phone number is too long'),
  message: z.string().optional(),
  selectedItems: z.array(z.string()).optional(),
});

type QuoteFormValues = z.infer<typeof quoteFormSchema>;

function formatDateDisplay(dateStr: string): string {
  if (!dateStr) return 'Not selected';
  
  if (dateStr.includes('|')) {
    const [start, end] = dateStr.split('|');
    const startDate = parse(start, 'yyyy-MM-dd', new Date());
    const endDate = parse(end, 'yyyy-MM-dd', new Date());
    return `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d')}`;
  }
  
  const date = parse(dateStr, 'yyyy-MM-dd', new Date());
  return format(date, 'EEE, MMM d');
}

export default function QuoteRequest() {
  const [, setLocationPath] = useLocation();
  const { postcode, address, w3w, placement, wasteType, size, providerId, deliveryDate, collectionDate } = useJourneyStore();
  
  const [submitted, setSubmitted] = useState(false);
  
  const provider = providers.find(p => p.id === providerId);
  const skipInfo = skipSizeNames[size || '6yd'] || { name: 'Skip', yards: '' };
  
  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      email: '',
      phone: '',
      message: '',
      selectedItems: [],
    },
  });
  
  const selectedItems = form.watch('selectedItems') || [];
  
  const toggleItem = (itemId: string) => {
    const currentItems = form.getValues('selectedItems') || [];
    const newItems = currentItems.includes(itemId)
      ? currentItems.filter(id => id !== itemId)
      : [...currentItems, itemId];
    form.setValue('selectedItems', newItems);
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
          
          <ProgressRibbon currentStep={4} />
          
          <div className="space-y-6 mt-8">
            <Card className="p-5" data-testid="card-summary">
              <h2 className="text-lg font-semibold text-foreground mb-4">Your Selection Summary</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3" data-testid="summary-location">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-primary uppercase tracking-wide">Location</p>
                    <p className="font-semibold text-foreground" data-testid="text-postcode">{postcode || 'Not set'}</p>
                    {address && <p className="text-sm text-muted-foreground" data-testid="text-address">{address}</p>}
                    {w3w && <p className="text-xs text-muted-foreground mt-0.5" data-testid="text-w3w">///{w3w}</p>}
                  </div>
                </div>
                
                <div className="flex items-start gap-3" data-testid="summary-skip">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Package className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-primary uppercase tracking-wide">Skip Size</p>
                    <p className="font-semibold text-foreground" data-testid="text-skip-name">{skipInfo.name}</p>
                    <p className="text-sm text-muted-foreground" data-testid="text-skip-yards">{skipInfo.yards}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3" data-testid="summary-waste">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Trash2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-primary uppercase tracking-wide">Waste Type</p>
                    <p className="font-semibold text-foreground" data-testid="text-waste-type">{wasteType || 'General Waste'}</p>
                    <p className="text-sm text-muted-foreground" data-testid="text-placement">{placement === 'road' ? 'On Road' : 'On Property'}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3" data-testid="summary-dates">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-primary uppercase tracking-wide">Dates</p>
                    <p className="font-semibold text-foreground" data-testid="text-delivery">{formatDateDisplay(deliveryDate)}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1" data-testid="text-collection">
                      <CalendarCheck className="w-3 h-3" />
                      Collection: {formatDateDisplay(collectionDate)}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="p-5" data-testid="card-items">
              <h2 className="text-lg font-semibold text-foreground mb-2">Items to Dispose</h2>
              <p className="text-sm text-muted-foreground mb-4">Select any items you'd like included in your quote</p>
              
              <div className="grid grid-cols-2 gap-3">
                {allItems.map((item) => (
                  <div 
                    key={item.id}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-md border transition-all cursor-pointer",
                      selectedItems.includes(item.id)
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50",
                      !item.appropriate && "opacity-70"
                    )}
                    onClick={() => toggleItem(item.id)}
                    data-testid={`item-${item.id}`}
                  >
                    <Checkbox 
                      checked={selectedItems.includes(item.id)}
                      onCheckedChange={() => toggleItem(item.id)}
                      data-testid={`checkbox-${item.id}`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{item.name}</p>
                      {!item.appropriate && (
                        <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          May require special handling
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            
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
                      onClick={() => setLocationPath('/providers')}
                      data-testid="button-back"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Providers
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
