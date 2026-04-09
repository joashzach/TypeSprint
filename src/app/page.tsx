import Link from 'next/link';
import { Button } from '@/components/ui/button';
import SiteHeader from '@/components/ui/SiteHeader';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-hidden">
      <SiteHeader />

      <main className="flex-1 flex flex-col items-center justify-center px-8">
        <div className="max-w-xl w-full text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none uppercase text-primary">
            Input Speed Test
          </h1>

          <p className="text-sm text-muted-foreground uppercase tracking-widest font-medium">
            Zero Tolerance for Errors.
          </p>

          <div className="pt-6">
            <Link href="/test">
              <Button size="lg" className="h-16 px-12 text-lg font-black uppercase rounded-none bg-primary text-foreground hover:bg-primary/80 transition-all">
                Initiate Session
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
