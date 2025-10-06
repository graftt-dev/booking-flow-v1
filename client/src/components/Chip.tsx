import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChipProps {
  children: React.ReactNode;
  selected?: boolean;
  onRemove?: () => void;
  onClick?: () => void;
  className?: string;
}

export default function Chip({ children, selected, onRemove, onClick, className }: ChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-md border transition-all",
        selected
          ? "bg-primary text-primary-foreground border-primary-border"
          : "bg-card text-card-foreground border-card-border hover-elevate active-elevate-2",
        className
      )}
      data-testid="chip"
    >
      <span className="text-sm font-medium">{children}</span>
      {onRemove && (
        <X
          className="w-4 h-4 ml-1"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        />
      )}
    </button>
  );
}
