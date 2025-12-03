import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import SearchBar from '@/components/SearchBar';
import { useJourneyStore } from '@/store/journeyStore';
import Header from '@/components/Header';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, X } from 'lucide-react';

const mockAddresses = [
  { id: 1, address: '10 Downing Street, London', postcode: 'SW1A 2AA', lat: 51.5034, lng: -0.1276, noProviders: false },
  { id: 2, address: '221B Baker Street, London', postcode: 'NW1 6XE', lat: 51.5238, lng: -0.1585, noProviders: false },
  { id: 3, address: '1 Abbey Road, London', postcode: 'NW8 9AY', lat: 51.5319, lng: -0.1778, noProviders: false },
  { id: 4, address: '30 St Mary Axe, London', postcode: 'EC3A 8EP', lat: 51.5145, lng: -0.0803, noProviders: false },
  { id: 5, address: 'Tower Bridge Road, London', postcode: 'SE1 2UP', lat: 51.5055, lng: -0.0754, noProviders: false },
  { id: 6, address: '42 Test Lane, Manchester', postcode: 'M1 1AE', lat: 53.4808, lng: -2.2426, noProviders: true },
];

export default function Home() {
  const [, setLocation] = useLocation();
  const { postcode, setPostcode, setAddress } = useJourneyStore();
  const [showAddresses, setShowAddresses] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<typeof mockAddresses[0] | null>(null);
  const [searchValue, setSearchValue] = useState('');
  
  useEffect(() => {
    if (searchValue && searchValue.length > 0 && !selectedAddress) {
      setShowAddresses(true);
    } else {
      setShowAddresses(false);
    }
  }, [searchValue, selectedAddress]);
  
  const handleAddressSelect = (addr: typeof mockAddresses[0]) => {
    setSelectedAddress(addr);
    setPostcode(addr.postcode);
    setAddress(addr.address);
    useJourneyStore.getState().setLocation(addr.lat, addr.lng, '');
    setShowAddresses(false);
    setSearchValue('');
  };
  
  const handleEditAddress = () => {
    setSelectedAddress(null);
    setSearchValue('');
  };
  
  const handleGetStarted = () => {
    if (selectedAddress) {
      setLocation('/location');
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-16"
      >
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground tracking-tight" data-testid="text-hero-title">
              The Household Name
              <br />
              for Skip Hire
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="text-hero-subtitle">
              Skip Hire you can trust.
            </p>
          </div>
          
          <div className="space-y-6 pt-8">
            <div className="max-w-2xl mx-auto space-y-4">
              <AnimatePresence>
                {selectedAddress && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex gap-2 justify-center flex-wrap"
                    data-testid="selected-address-chips"
                  >
                    <button
                      onClick={handleEditAddress}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#05E4C0]/10 text-[#06062D] dark:text-[#05E4C0] border border-[#05E4C0]/30 rounded-full text-sm font-medium hover-elevate active-elevate-2"
                      data-testid="chip-postcode"
                    >
                      <span>{selectedAddress.postcode}</span>
                      <X className="w-3 h-3" />
                    </button>
                    <button
                      onClick={handleEditAddress}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#05E4C0]/10 text-[#06062D] dark:text-[#05E4C0] border border-[#05E4C0]/30 rounded-full text-sm font-medium hover-elevate active-elevate-2"
                      data-testid="chip-address"
                    >
                      <span>{selectedAddress.address.split(',')[0]}</span>
                      <X className="w-3 h-3" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="relative">
                <SearchBar
                  value={searchValue}
                  onChange={setSearchValue}
                  placeholder="Enter postcode or address"
                />
                
                {showAddresses && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute z-10 w-full mt-2 bg-white dark:bg-card border border-border rounded-md shadow-lg overflow-hidden"
                    data-testid="dropdown-addresses"
                  >
                    {mockAddresses.map((addr) => (
                      <button
                        key={addr.id}
                        onClick={() => handleAddressSelect(addr)}
                        className={`w-full px-4 py-3 text-left hover-elevate active-elevate-2 flex items-start gap-3 border-b border-border last:border-b-0 ${addr.noProviders ? 'bg-destructive/5' : ''}`}
                        data-testid={`address-option-${addr.id}`}
                      >
                        <MapPin className={`w-4 h-4 mt-1 flex-shrink-0 ${addr.noProviders ? 'text-destructive' : 'text-primary'}`} />
                        <div className="flex-1 min-w-0">
                          <div className={`font-medium ${addr.noProviders ? 'text-destructive' : 'text-foreground'}`}>{addr.address}</div>
                          <div className={`text-sm ${addr.noProviders ? 'text-destructive/70' : 'text-muted-foreground'}`}>{addr.postcode}</div>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>
            
            <Button 
              size="lg" 
              className="px-12 h-12 text-lg"
              onClick={handleGetStarted}
              disabled={!selectedAddress}
              data-testid="button-hire-my-skip"
            >
              Hire My Skip
            </Button>
          </div>
        </div>
      </motion.main>
    </div>
  );
}
