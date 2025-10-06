import { useState } from 'react';
import SearchBar from '../SearchBar';

export default function SearchBarExample() {
  const [value, setValue] = useState('');
  
  return (
    <div className="p-8">
      <SearchBar
        value={value}
        onChange={setValue}
        placeholder="Enter postcode or address"
      />
    </div>
  );
}
