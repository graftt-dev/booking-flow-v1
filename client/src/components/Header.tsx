import { useState } from 'react';
import { Link } from 'wouter';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import logoPath from '@assets/GRAFFT Primary Logo (3)_1759848271762.png';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Hamburger menu on left */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden"
            data-testid="button-menu-toggle"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
          
          <Link href="/" data-testid="link-home">
            <img src={logoPath} alt="GRAFTT" className="h-6" />
          </Link>
          
          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm text-foreground hover-elevate active-elevate-2 px-3 py-2 rounded-md" data-testid="link-how-it-works">
              How it works
            </a>
            <a href="#" className="text-sm text-foreground hover-elevate active-elevate-2 px-3 py-2 rounded-md" data-testid="link-help">
              Help
            </a>
            <a href="#" className="text-sm text-foreground hover-elevate active-elevate-2 px-3 py-2 rounded-md" data-testid="link-contact">
              Contact
            </a>
          </nav>
          
          {/* Spacer for mobile to balance the hamburger */}
          <div className="w-9 md:hidden" />
        </div>
      </div>
      
      {/* Mobile slide-out menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-64 bg-white border-r border-b border-border shadow-lg z-50">
          <nav className="flex flex-col p-4 gap-2">
            <a 
              href="#" 
              className="text-sm text-foreground hover-elevate active-elevate-2 px-3 py-3 rounded-md"
              onClick={() => setMenuOpen(false)}
              data-testid="link-how-it-works-mobile"
            >
              How it works
            </a>
            <a 
              href="#" 
              className="text-sm text-foreground hover-elevate active-elevate-2 px-3 py-3 rounded-md"
              onClick={() => setMenuOpen(false)}
              data-testid="link-help-mobile"
            >
              Help
            </a>
            <a 
              href="#" 
              className="text-sm text-foreground hover-elevate active-elevate-2 px-3 py-3 rounded-md"
              onClick={() => setMenuOpen(false)}
              data-testid="link-contact-mobile"
            >
              Contact
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
