import { useState } from 'react';
import Chip from '../Chip';

export default function ChipExample() {
  const [selected, setSelected] = useState(false);
  
  return (
    <div className="flex gap-4 items-center p-8">
      <Chip selected={selected} onClick={() => setSelected(!selected)}>
        Click me
      </Chip>
      <Chip selected={false} onRemove={() => console.log('removed')}>
        With Remove
      </Chip>
      <Chip selected={true}>
        Selected
      </Chip>
    </div>
  );
}
