import { motion } from 'framer-motion';

interface ProgressRibbonProps {
  currentStep: number;
}

const steps = [
  "Placement",
  "Size",
  "Waste",
  "Dates",
  "Providers",
  "Items",
  "Checkout",
  "Done"
];

export default function ProgressRibbon({ currentStep }: ProgressRibbonProps) {
  const progress = ((currentStep + 1) / steps.length) * 100;
  
  return (
    <div className="w-full max-w-4xl mx-auto mt-6 mb-8" data-testid="progress-ribbon">
      <div className="relative">
        <div className="h-1 bg-secondary rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
        
        <div className="flex justify-between mt-3">
          {steps.map((step, index) => (
            <div key={step} className="flex flex-col items-center">
              <span
                className={`text-xs font-medium transition-colors ${
                  index <= currentStep
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                }`}
                data-testid={`step-${step.toLowerCase()}`}
              >
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
