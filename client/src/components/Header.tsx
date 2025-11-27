import { Link } from 'wouter';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#0a1628]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-14">
          <Link href="/" data-testid="link-home">
            <div className="w-10 h-10 rounded-full bg-[#05E4C0] flex items-center justify-center">
              <span className="text-[#0a1628] font-bold text-xl">G</span>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
