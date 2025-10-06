import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = "Enter postcode or address" }: SearchBarProps) {
  const [focused, setFocused] = useState(false);
  
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className={`relative flex items-center transition-all ${focused ? 'ring-2 ring-primary' : ''} rounded-md`}>
        <Search className="absolute left-4 w-5 h-5 text-muted-foreground" />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className="pl-12 h-14 text-lg border-border"
          data-testid="input-search"
        />
      </div>
    </div>
  );
}
