import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCcw, Share2, Target, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TestStats } from './TypingTest';

interface ResultsSummaryProps {
  stats: TestStats;
  onRestart: () => void;
}

export default function ResultsSummary({ stats, onRestart }: ResultsSummaryProps) {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 p-8 clean-frame">
      <div className="flex items-center justify-between border-b border-primary/30 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px]">
            <Trophy className="w-4 h-4" />
            Evaluation Complete
          </div>
          <h2 className="text-4xl font-black uppercase tracking-tighter text-primary">Summary</h2>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ResultBox label="Velocity (WPM)" value={stats.wpm} highlight />
        <ResultBox label="Accuracy (%)" value={stats.accuracy} highlight />
        <ResultBox label="Errors" value={stats.errors} />
        <ResultBox label="Time (s)" value={stats.timeSpent} />
      </div>

      <div className="p-6 bg-primary/5 border-l-4 border-primary space-y-2">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" />
          <span className="text-[10px] font-black uppercase tracking-widest text-primary">Efficiency Rating</span>
        </div>
        <p className="text-sm font-medium leading-relaxed text-muted-foreground">
          {stats.accuracy === 100 
            ? "Elite performance. Perfect accuracy maintained. Increase velocity." 
            : `Compromised by ${stats.errors} errors. Recalibrate input and try again.`}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Button size="lg" onClick={onRestart} className="flex-1 h-14 rounded-none bg-primary hover:bg-primary/90 text-foreground font-black uppercase tracking-wider transition-all">
          <RefreshCcw className="w-5 h-5 mr-3" />
          Re-Initiate
        </Button>
        <Button size="lg" variant="outline" className="flex-1 h-14 rounded-none border border-primary/30 text-primary font-black uppercase tracking-wider hover:bg-primary hover:text-foreground transition-all">
          <Share2 className="w-5 h-5 mr-3" />
          Export Data
        </Button>
      </div>
    </div>
  );
}

function ResultBox({ label, value, highlight }: { label: string, value: string | number, highlight?: boolean }) {
  return (
    <div className={cn(
      "p-6 flex flex-col gap-2 border border-primary/10 transition-all",
      highlight && "bg-primary/10 border-primary/30"
    )}>
      <p className={cn(
        "text-[10px] font-black uppercase tracking-widest",
        highlight ? "text-primary" : "text-muted-foreground"
      )}>{label}</p>
      <p className="text-4xl font-black tracking-tighter tabular-nums uppercase text-primary">{value}</p>
    </div>
  );
}
