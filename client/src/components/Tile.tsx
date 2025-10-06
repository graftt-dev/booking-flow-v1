import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface TileProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  selected?: boolean;
  onClick?: () => void;
  badge?: string;
  children?: React.ReactNode;
  testId?: string;
}

export default function Tile({ icon: Icon, title, description, selected, onClick, badge, children, testId }: TileProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative p-6 rounded-md border-2 transition-all text-left w-full hover-elevate active-elevate-2",
        selected
          ? "border-primary shadow-soft"
          : "border-border bg-card"
      )}
      data-testid={testId || "tile"}
    >
      {badge && (
        <span className="absolute top-3 right-3 px-2 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-md">
          {badge}
        </span>
      )}
      
      {Icon && (
        <Icon className={cn(
          "w-8 h-8 mb-4",
          selected ? "text-primary" : "text-foreground"
        )} />
      )}
      
      <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {children}
    </button>
  );
}
