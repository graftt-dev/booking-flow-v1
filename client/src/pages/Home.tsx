import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import SearchBar from '@/components/SearchBar';
import { useJourneyStore } from '@/store/journeyStore';
import Header from '@/components/Header';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

const mockAddresses = [
  { id: 1, address: '10 Downing Street, London', postcode: 'SW1A 2AA', lat: 51.5034, lng: -0.1276 },
  { id: 2, address: '221B Baker Street, London', postcode: 'NW1 6XE', lat: 51.5238, lng: -0.1585 },
  { id: 3, address: '1 Abbey Road, London', postcode: 'NW8 9AY', lat: 51.5319, lng: -0.1778 },
  { id: 4, address: '30 St Mary Axe, London', postcode: 'EC3A 8EP', lat: 51.5145, lng: -0.0803 },
  { id: 5, address: 'Tower Bridge Road, London', postcode: 'SE1 2UP', lat: 51.5055, lng: -0.0754 },
];

export default function Home() {
  const [, setLocation] = useLocation();
  const { postcode, setPostcode, setAddress } = useJourneyStore();
  const [showAddresses, setShowAddresses] = useState(false);
  
  useEffect(() => {
    if (postcode && postcode.length > 0) {
      setShowAddresses(true);
    } else {
      setShowAddresses(false);
    }
  }, [postcode]);
  
  const handleAddressSelect = (addr: typeof mockAddresses[0]) => {
    setPostcode(addr.postcode);
    setAddress(addr.address);
    useJourneyStore.getState().setLocation(addr.lat, addr.lng, '');
    setShowAddresses(false);
    setLocation('/location');
  };
  
  const handleGetStarted = () => {
    setLocation('/location');
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
              UK's No.1 Marketplace for Skip Hire
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="text-hero-subtitle">
              Skip hire you can trust – no cowboys, no fly-tipping, no fines.
            </p>
          </div>
          
          <div className="space-y-6 pt-8">
            <div className="relative">
              <SearchBar
                value={postcode}
                onChange={setPostcode}
                placeholder="Enter postcode or address"
              />
              
              {showAddresses && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute z-10 w-full mt-2 bg-background border border-border rounded-md shadow-lg overflow-hidden"
                  data-testid="dropdown-addresses"
                >
                  {mockAddresses.map((addr) => (
                    <button
                      key={addr.id}
                      onClick={() => handleAddressSelect(addr)}
                      className="w-full px-4 py-3 text-left hover-elevate flex items-start gap-3 border-b border-border last:border-b-0"
                      data-testid={`address-option-${addr.id}`}
                    >
                      <MapPin className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-foreground">{addr.address}</div>
                        <div className="text-sm text-muted-foreground">{addr.postcode}</div>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
            
            <Button 
              size="lg" 
              className="px-12 h-12 text-lg"
              onClick={handleGetStarted}
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
