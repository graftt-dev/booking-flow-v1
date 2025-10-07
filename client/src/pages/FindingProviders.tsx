import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { useJourneyStore } from '@/store/journeyStore';
import Header from '@/components/Header';

export default function FindingProviders() {
  const [, setLocation] = useLocation();
  const { postcode, placement } = useJourneyStore();
  const [progress, setProgress] = useState(0);
  
  const isRoadPlacement = placement === 'road';
  
  useEffect(() => {
    const duration = 1800;
    const interval = 20;
    const steps = duration / interval;
    const increment = 100 / steps;
    
    let currentProgress = 0;
    const progressInterval = setInterval(() => {
      currentProgress += increment;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(progressInterval);
      }
      setProgress(currentProgress);
    }, interval);
    
    const timer = setTimeout(() => {
      setLocation('/providers');
    }, duration);
    
    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [setLocation]);
  
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
        className="container mx-auto px-4 py-16"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.4 }}
            className="text-center space-y-8"
          >
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-[#06062D]" data-testid="text-finding-providers">
                Finding providers near {postcode}…
              </h1>
              
              <p className="text-base text-muted-foreground">
                Checking live prices, delivery slots, and permit availability
              </p>
              
              {isRoadPlacement && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: prefersReducedMotion ? 0 : 0.2 }}
                  className="text-sm font-medium text-[#05E4C0]"
                  data-testid="text-road-placement"
                >
                  Road placement detected — permit-ready providers first
                </motion.p>
              )}
            </div>
            
            <div className="w-full max-w-md mx-auto">
              <div className="h-1 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[#05E4C0]"
                  style={{ width: `${progress}%` }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.1 }}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4 mt-12 max-w-3xl mx-auto">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: prefersReducedMotion ? 0 : i * 0.1 }}
                  className="bg-card border border-card-border rounded-md p-6 space-y-4"
                  data-testid={`skeleton-provider-${i}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-secondary animate-pulse" />
                      <div className="space-y-2">
                        <div className="h-5 w-32 bg-secondary animate-pulse rounded" />
                        <div className="h-3 w-24 bg-secondary animate-pulse rounded" />
                      </div>
                    </div>
                    <div className="h-8 w-20 bg-secondary animate-pulse rounded" />
                  </div>
                  
                  <div className="flex gap-4 pt-2">
                    <div className="h-3 w-24 bg-secondary animate-pulse rounded" />
                    <div className="h-3 w-28 bg-secondary animate-pulse rounded" />
                    <div className="h-3 w-20 bg-secondary animate-pulse rounded" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.main>
    </div>
  );
}
