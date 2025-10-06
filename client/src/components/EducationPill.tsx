import { Info } from 'lucide-react';

interface EducationPillProps {
  text: string;
}

export default function EducationPill({ text }: EducationPillProps) {
  return (
    <div className="mt-8 flex items-center justify-center" data-testid="education-pill">
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-full border border-border">
        <Info className="w-4 h-4 text-primary" />
        <span className="text-sm text-muted-foreground">{text}</span>
      </div>
    </div>
  );
}
