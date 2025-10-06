import { useState } from 'react';
import ProviderCard from '../ProviderCard';
import { providers } from '@/lib/providers';

export default function ProviderCardExample() {
  const [selected, setSelected] = useState<string | null>(null);
  const provider = providers[0];
  
  return (
    <div className="p-8 max-w-md">
      <ProviderCard
        provider={provider}
        price={294}
        selected={selected === provider.id}
        onSelect={() => setSelected(provider.id)}
        basePrice={220}
        extras={25}
        permit={0}
        vat={49}
      />
    </div>
  );
}
