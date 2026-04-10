import Link from 'next/link';
import { Gauge } from 'lucide-react';

export default function SiteHeader() {
  return (
    <header className="px-6 flex items-center border-b border-primary/10 sticky top-0 bg-background/95 backdrop-blur-md z-50 h-16">
      <Link href="/" className="flex items-center gap-2.5">
        <div className="bg-primary rounded-sm p-1.5 flex items-center justify-center">
          <Gauge className="w-5 h-5 text-foreground" strokeWidth={2} />
        </div>
        <span
          className="font-black uppercase text-foreground text-base"
          style={{ letterSpacing: '0.12em' }}
        >
          Type<span className="text-primary">Sprint</span>
        </span>
      </Link>
    </header>
  );
}
