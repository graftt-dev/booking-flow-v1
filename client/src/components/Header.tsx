import { Link } from 'wouter';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" data-testid="link-home">
            <span className="text-2xl font-bold text-foreground tracking-tight">GRAFTT</span>
          </Link>
          
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
        </div>
      </div>
    </header>
  );
}
