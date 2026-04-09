
import TypingTestWrapper from '@/components/typing/TypingTestWrapper';
import { Target } from 'lucide-react';
import Link from 'next/link';

export default function TestPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="px-6 py-4 border-b border-primary/10 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-sm z-50">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary p-1.5 rounded-none">
            <Target className="text-black w-4 h-4" />
          </div>
          <span className="text-lg font-black tracking-tighter uppercase italic text-primary">TypeSprint</span>
        </Link>
        <div className="hidden sm:block text-[10px] font-black text-primary/40 uppercase tracking-[0.3em]">
          Evaluation Environment
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center p-4 py-12">
        <TypingTestWrapper />
      </main>
      
      <footer className="p-8 text-center border-t border-primary/10">
        <div className="inline-flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground">
          <span>Shift + R to Re-Initiate</span>
        </div>
      </footer>
    </div>
  );
}
