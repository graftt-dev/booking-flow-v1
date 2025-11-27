import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Shield, FileText, ArrowLeft, ChevronDown } from 'lucide-react';
import Header from '@/components/Header';
import ProgressRibbon from '@/components/ProgressRibbon';
import EducationPill from '@/components/EducationPill';
import { useJourneyStore } from '@/store/journeyStore';
import { providers as allProviders } from '@/lib/providers';
import { formatCurrency, cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [dutyOfCareChecked, setDutyOfCareChecked] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  
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

              <p>
                {items.length > 0 ? (
                  <>
                    You've mentioned you'll be disposing of{' '}
                    <span 
                      className="inline-flex items-center bg-[#05E4C0]/10 text-[#05E4C0] border border-[#05E4C0]/20 font-semibold px-2 py-0.5 rounded-full"
                      data-testid="badge-items"
                    >
                      {getItemsText()}
                    </span>
                    , which we've included in the quote.
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
            
            <div className="bg-card border border-card-border rounded-md p-4 space-y-3">
              <div 
                className={cn(
                  "border rounded-md transition-all",
                  dutyOfCareChecked ? "border-primary bg-primary/5" : "border-border"
                )}
              >
                <label className="flex items-center gap-3 p-3 cursor-pointer">
                  <Checkbox 
                    checked={dutyOfCareChecked} 
                    onCheckedChange={(checked) => setDutyOfCareChecked(checked as boolean)}
                    data-testid="checkbox-duty-of-care"
                  />
                  <div className="flex items-center gap-2 flex-1">
                    <Shield className="w-4 h-4 text-primary" />
                    <span className="font-medium text-sm">Duty of Care</span>
                  </div>
                  <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", dutyOfCareChecked && "rotate-180")} />
                </label>
                <AnimatePresence>
                  {dutyOfCareChecked && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 text-sm text-muted-foreground space-y-4">
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">1. Duty of Care</h4>
                          <p className="mb-3">Under Section 34 of the Environmental Protection Act 1990, every person who produces, keeps, transports, or disposes of controlled waste has a legal duty of care. By placing an order through the GRAFTT platform, the customer acknowledges and accepts that they remain the producer of the waste and are legally responsible for it at all times until it is lawfully disposed of at an authorised facility. The customer confirms that all information provided in relation to the waste, including its type, quantity, and composition, is accurate and complete to the best of their knowledge.</p>
                          <p className="mb-3">The customer agrees to take all reasonable steps to ensure that their waste is stored, handled, and transferred in a manner that prevents escape, pollution, harm to human health, or illegal disposal. This duty applies whether the skip is ordered directly from a provider or via GRAFTT as an introducing platform. The customer understands that reliance on a third-party provider does not remove or reduce their statutory obligations under waste legislation.</p>
                          <p>Where waste is misdescribed, contains prohibited or hazardous materials, or is otherwise non-compliant with the information provided at the time of booking, the customer accepts full responsibility for any resulting costs, enforcement action, penalties, or refusal of collection. GRAFTT does not accept liability for any breach of duty arising from inaccurate declarations or unlawful use of the skip.</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">2. Waste Hierarchy Compliance</h4>
                          <p className="mb-3">The customer confirms that they have considered and applied the waste hierarchy as required under the Waste (England and Wales) Regulations 2011 prior to ordering a skip. The waste hierarchy places a legal obligation on waste producers to prioritise prevention, followed by reuse, recycling, recovery, and disposal only as a final option. By proceeding with a booking, the customer confirms that disposal of waste via skip hire is appropriate and proportionate for the materials being removed.</p>
                          <p className="mb-3">The customer acknowledges that they have taken reasonable steps to minimise the amount of waste produced and to separate materials for reuse or recycling where practicable. The customer further confirms that the waste placed in the skip is suitable for disposal through the selected service and does not include materials that should reasonably have been diverted to alternative lawful treatment or recovery routes.</p>
                          <p>The customer understands that waste hierarchy compliance may be subject to audit or inspection by regulatory authorities and agrees to cooperate fully with any lawful requests for information relating to waste composition, handling, and disposal. Any failure to comply with waste hierarchy requirements, whether intentional or due to negligence, remains the responsibility of the customer, and GRAFTT shall not be liable for any consequences arising from such non-compliance.</p>
                        </div>
                        <div className="pt-2 border-t">
                          <p className="font-medium text-foreground">By checking this box, the customer confirms that they have read, understood, and agreed to the Duty of Care and Waste Hierarchy Terms and that they accept full legal responsibility for compliance with applicable waste legislation.</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <div 
                className={cn(
                  "border rounded-md transition-all",
                  termsChecked ? "border-primary bg-primary/5" : "border-border"
                )}
              >
                <label className="flex items-center gap-3 p-3 cursor-pointer">
                  <Checkbox 
                    checked={termsChecked} 
                    onCheckedChange={(checked) => setTermsChecked(checked as boolean)}
                    data-testid="checkbox-terms"
                  />
                  <div className="flex items-center gap-2 flex-1">
                    <FileText className="w-4 h-4 text-primary" />
                    <span className="font-medium text-sm">Terms & Conditions</span>
                  </div>
                  <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", termsChecked && "rotate-180")} />
                </label>
                <AnimatePresence>
                  {termsChecked && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 text-sm text-muted-foreground space-y-4">
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">1. Introduction</h4>
                          <p>These Terms and Conditions govern the use of the GRAFTT platform and the placement of orders by customers for skip hire and related waste services. By accessing the GRAFTT website, creating a booking, or completing a transaction, the customer agrees to be bound by these Terms and Conditions. If the customer does not agree to these Terms, they must not proceed with a booking.</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">2. Role of GRAFTT</h4>
                          <p>GRAFTT operates as an online marketplace and introducing broker only. GRAFTT does not itself provide skip hire services, waste collection, transport, treatment, or disposal services. All services advertised on the platform are provided by independent third-party providers. Any contract for skip hire or waste services is formed exclusively between the customer and the selected provider, and GRAFTT is not a contracting party to those arrangements.</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">3. Provider Responsibility</h4>
                          <p>The provider is solely responsible for the delivery, placement, collection, and removal of skips and for the lawful transport, treatment, and disposal of waste in accordance with all applicable laws and regulations. The provider is also responsible for holding and maintaining all licences, permits, and authorisations required to operate as a waste carrier and to dispose of waste at authorised facilities. GRAFTT does not guarantee performance, availability, or service standards of any provider.</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">4. Customer Responsibility</h4>
                          <p>The customer confirms that all information supplied at the time of booking is accurate and complete, including information relating to waste type, waste quantity, skip placement location, access conditions, and permit requirements. The customer remains legally responsible for their waste at all times and acknowledges their statutory duty of care under waste legislation. The customer agrees that inaccurate or misleading information may result in additional charges, refusal of service, enforcement action, or liability for third-party costs.</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">5. Prices and Payments</h4>
                          <p>All prices displayed on the GRAFTT platform are supplied by providers and are indicative only. Prices may change where waste descriptions, access arrangements, hire duration, or permit requirements differ from those declared at the time of booking. GRAFTT is not responsible for additional charges levied by a provider as a result of changes, inaccuracies, or non-compliance.</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">6. Permits and Permissions</h4>
                          <p>Where a skip is placed on a road, pavement, verge, or any other public land, the customer is responsible for ensuring that a valid permit issued by the relevant local authority is in place prior to delivery, unless expressly agreed otherwise in writing by the provider. GRAFTT accepts no liability for delays, fines, removal costs, or enforcement action arising from failure to obtain or comply with permit requirements.</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">7. Damage and Access</h4>
                          <p>The customer is responsible for ensuring suitable access for delivery and collection vehicles and for any damage to surfaces, underground services, or third-party property unless caused by proven negligence of the provider. GRAFTT accepts no liability for property damage, obstruction, or access-related issues arising during the provision of services by the provider.</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">8. Limitation of Liability</h4>
                          <p>To the fullest extent permitted by law, GRAFTT excludes all warranties, representations, and conditions relating to services provided by third-party providers. GRAFTT shall not be liable for any loss, damage, delay, inconvenience, personal injury, enforcement action, or financial loss arising from or in connection with services provided by a provider. Where liability cannot be excluded by law, GRAFTT's total liability shall be limited to the amount paid by the customer to GRAFTT in respect of the relevant booking.</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">9. Indemnity</h4>
                          <p>The customer agrees to indemnify and hold harmless GRAFTT against all claims, losses, damages, fines, penalties, costs, and expenses arising from the customer's breach of these Terms and Conditions, including but not limited to misdescription of waste, inclusion of prohibited materials, failure to obtain required permits, or non-compliance with applicable legislation.</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">10. Cancellations and Refunds</h4>
                          <p>Cancellation, amendment, and refund terms are set by individual providers and may vary. GRAFTT does not control provider cancellation policies and accepts no liability for fees, deductions, or refusal of refunds imposed by a provider.</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">11. Intellectual Property</h4>
                          <p>All intellectual property rights in the GRAFTT platform, including software, design, branding, content, and functionality, remain the property of GRAFTT or its licensors. No rights are granted to the customer except those necessary to use the platform in accordance with these Terms.</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">12. Changes to Terms</h4>
                          <p>GRAFTT reserves the right to amend these Terms and Conditions at any time. Updated Terms shall apply to all bookings made after the date of publication on the platform.</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">13. Governing Law and Jurisdiction</h4>
                          <p>These Terms and Conditions are governed by and construed in accordance with the laws of England and Wales. The courts of England and Wales shall have exclusive jurisdiction to settle any disputes arising from or in connection with these Terms.</p>
                        </div>
                        <div className="pt-2 border-t">
                          <p className="font-medium text-foreground">By proceeding with a booking or selecting this checkbox, the customer confirms that they have read, understood, and agree to be bound by the GRAFTT Platform Terms & Conditions.</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setLocation('/items')}
                data-testid="button-back"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                type="submit"
                size="lg"
                className="flex-1"
                disabled={loading || !dutyOfCareChecked || !termsChecked}
                data-testid="button-pay"
              >
                {loading ? 'Processing...' : `Pay ${formatCurrency(totals.total)}`}
              </Button>
            </div>
          </form>
        </div>
      </motion.main>
    </div>
  );
}
