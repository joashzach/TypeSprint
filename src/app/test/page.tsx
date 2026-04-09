
import TypingTestWrapper from '@/components/typing/TypingTestWrapper';
import SiteHeader from '@/components/ui/SiteHeader';

export default function TestPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex-1 flex flex-col items-center p-4 py-12">
        <TypingTestWrapper />
      </main>

      <footer className="p-6 text-center border-t border-primary/10">
        <span className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/50">
          Shift + R to Reset
        </span>
      </footer>
    </div>
  );
}
