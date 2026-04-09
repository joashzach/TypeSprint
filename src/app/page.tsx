import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Target } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-hidden">
      <header className="px-8 py-8 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-1.5 rounded-none">
            <Target className="w-5 h-5 text-foreground" />
          </div>
          <span className="text-xl font-black tracking-tighter uppercase text-primary">TypeSprint</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-8">
        <div className="max-w-xl w-full text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none uppercase text-primary">
            Input Speed Test
          </h1>
          
          <p className="font-poppins text-sm text-muted-foreground uppercase tracking-widest font-medium">
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

      <footer className="py-8 border-t border-primary/10">
        <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
        </div>
      </footer>
    </div>
  );
}
