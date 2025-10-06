import { useState } from 'react';
import Tile from '../Tile';
import { Home, Truck } from 'lucide-react';

export default function TileExample() {
  const [selected, setSelected] = useState<string | null>(null);
  
  return (
    <div className="grid grid-cols-2 gap-4 p-8 max-w-2xl">
      <Tile
        icon={Home}
        title="On your property"
        description="No permit needed"
        selected={selected === 'property'}
        onClick={() => setSelected('property')}
      />
      <Tile
        icon={Truck}
        title="On the road"
        description="May require permit"
        selected={selected === 'road'}
        onClick={() => setSelected('road')}
        badge="Permit"
      />
    </div>
  );
}
